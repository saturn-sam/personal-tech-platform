import { createHash } from 'node:crypto';
import { brotliCompressSync, constants as zlibConstants, gzipSync } from 'node:zlib';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { extname, relative, resolve, sep } from 'node:path';
import process from 'node:process';

const DIST_DIR = resolve(process.cwd(), 'dist');
const PUBLIC_HEADERS_PATH = resolve(process.cwd(), 'public', '_headers');
const LOCAL_ORIGIN = 'https://ptkp.local';
const CLOUDFLARE_HEADERS_LINE_LIMIT = 2000;
const COMPRESSIBLE_EXTENSIONS = new Set([
  '.css',
  '.html',
  '.js',
  '.json',
  '.map',
  '.svg',
  '.txt',
  '.webmanifest',
  '.xml',
]);
const INLINE_SCRIPT_PATTERN = /<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
const CSP_META_TAG_PATTERN = /\s*<meta\b[^>]*http-equiv="Content-Security-Policy"[^>]*\/?>\s*/i;
const CHARSET_META_TAG_PATTERN = /<meta\b[^>]*charset="[^"]+"[^>]*\/?>/i;
const HEAD_OPEN_TAG_PATTERN = /<head\b[^>]*>/i;
const ID_PATTERN = /\sid="([^"]+)"/gi;
const CANONICAL_PATTERN = /<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/i;
const LINK_PATTERN = /<a\b[^>]*href="([^"]+)"/gi;
const LINK_TAG_PATTERN = /<link\b[^>]*href="([^"]+)"/gi;
const SCRIPT_SRC_PATTERN = /<script\b[^>]*src="([^"]+)"/gi;
const IMAGE_PATTERN = /<img\b[^>]*src="([^"]+)"/gi;
const SOURCE_SRC_PATTERN = /<source\b[^>]*src="([^"]+)"/gi;
const SOURCESET_PATTERN = /<(?:img|source)\b[^>]*srcset="([^"]+)"/gi;
const META_IMAGE_PATTERN =
  /<meta\b[^>]*(?:property|name)="(?:og:image|twitter:image)"[^>]*content="([^"]+)"/gi;

const fail = (message) => {
  throw new Error(message);
};

const toPosixPath = (value) => value.split(sep).join('/');

const walkFiles = (directory, rootDirectory = directory) => {
  const entries = readdirSync(directory, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const entryPath = resolve(directory, entry.name);

    if (entry.isDirectory()) {
      return walkFiles(entryPath, rootDirectory);
    }

    return toPosixPath(relative(rootDirectory, entryPath));
  });
};

const getHtmlRouteVariants = (filePath) => {
  if (filePath === 'index.html') {
    return ['/', '/index.html'];
  }

  if (filePath.endsWith('/index.html')) {
    const basePath = `/${filePath.slice(0, -'index.html'.length)}`;
    const normalizedBasePath = basePath.endsWith('/') ? basePath : `${basePath}/`;
    const trimmedPath = normalizedBasePath === '/' ? '/' : normalizedBasePath.slice(0, -1);

    return Array.from(
      new Set([normalizedBasePath, trimmedPath, `${normalizedBasePath}index.html`]),
    );
  }

  const htmlPath = `/${filePath}`;
  const extensionlessPath = htmlPath.replace(/\.html$/, '');

  return Array.from(new Set([htmlPath, extensionlessPath]));
};

const readTextFile = (path) => readFileSync(path, 'utf8');

const getInlineScriptHashes = (html) => {
  const hashSet = new Set();

  for (const match of html.matchAll(INLINE_SCRIPT_PATTERN)) {
    const contents = match[1] ?? '';

    if (!contents.trim()) {
      continue;
    }

    const hash = createHash('sha256').update(contents, 'utf8').digest('base64');
    hashSet.add(`'sha256-${hash}'`);
  }

  return Array.from(hashSet).sort();
};

const parseHeadersFile = (rawHeaders) => {
  const blocks = [];
  let currentBlock = null;

  for (const line of rawHeaders.split(/\r?\n/)) {
    const trimmedLine = line.trimEnd();

    if (!trimmedLine) {
      if (currentBlock) {
        blocks.push(currentBlock);
        currentBlock = null;
      }

      continue;
    }

    if (!line.startsWith('  ')) {
      if (currentBlock) {
        blocks.push(currentBlock);
      }

      currentBlock = {
        headers: [],
        pattern: trimmedLine,
      };

      continue;
    }

    currentBlock?.headers.push(trimmedLine.trim());
  }

  if (currentBlock) {
    blocks.push(currentBlock);
  }

  return blocks;
};

const getSiteOrigin = () => {
  const homepage = readTextFile(resolve(DIST_DIR, 'index.html'));
  const canonicalUrl = homepage.match(CANONICAL_PATTERN)?.[1];

  if (!canonicalUrl) {
    return LOCAL_ORIGIN;
  }

  return new URL(canonicalUrl, LOCAL_ORIGIN).origin;
};

const buildHeaderContentSecurityPolicy = () =>
  [
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    'upgrade-insecure-requests',
  ].join('; ');

const buildMetaContentSecurityPolicy = (inlineScriptHashes) =>
  [
    "default-src 'self'",
    "connect-src 'self'",
    "font-src 'self'",
    "img-src 'self' data:",
    "manifest-src 'self'",
    "media-src 'self'",
    `script-src 'self' ${inlineScriptHashes.join(' ')}`.trim(),
    "script-src-attr 'none'",
    "style-src 'self' 'unsafe-inline'",
    "worker-src 'self'",
  ].join('; ');

const updateRootHeaders = (blocks, securityHeaders) => {
  const rootBlock = blocks.find((block) => block.pattern === '/*');

  if (!rootBlock) {
    fail('Expected a /* block in public/_headers.');
  }

  const securityHeaderNames = new Set(
    securityHeaders.map((header) => header.slice(0, header.indexOf(':')).trim().toLowerCase()),
  );

  rootBlock.headers = [
    ...rootBlock.headers.filter((header) => {
      const headerName = header.slice(0, header.indexOf(':')).trim().toLowerCase();
      return !securityHeaderNames.has(headerName);
    }),
    ...securityHeaders,
  ];
};

const renderHeadersFile = (blocks) =>
  `${blocks
    .map((block) => [block.pattern, ...block.headers.map((header) => `  ${header}`)].join('\n'))
    .join('\n\n')}\n`;

const validateHeadersLineLengths = (headersFile) => {
  const offendingLines = headersFile
    .split(/\r?\n/)
    .map((line, index) => ({
      lineNumber: index + 1,
      length: line.length,
    }))
    .filter(({ length }) => length > CLOUDFLARE_HEADERS_LINE_LIMIT);

  if (offendingLines.length === 0) {
    return;
  }

  fail(
    [
      `Generated dist/_headers contains lines longer than Cloudflare's ${CLOUDFLARE_HEADERS_LINE_LIMIT}-character limit.`,
      ...offendingLines.map(({ lineNumber, length }) => `Line ${lineNumber}: ${length} characters`),
    ].join('\n'),
  );
};

const injectContentSecurityPolicyMeta = (html, contentSecurityPolicy) => {
  const metaTag = `\n    <meta http-equiv="Content-Security-Policy" content="${contentSecurityPolicy}" />`;
  const sanitizedHtml = html.replace(CSP_META_TAG_PATTERN, '\n');

  if (CHARSET_META_TAG_PATTERN.test(sanitizedHtml)) {
    return sanitizedHtml.replace(CHARSET_META_TAG_PATTERN, (match) => `${match}${metaTag}`);
  }

  if (HEAD_OPEN_TAG_PATTERN.test(sanitizedHtml)) {
    return sanitizedHtml.replace(HEAD_OPEN_TAG_PATTERN, (match) => `${match}${metaTag}`);
  }

  fail('Expected every generated HTML document to contain a <head> element.');
};

const extractMatches = (pattern, html) =>
  Array.from(html.matchAll(pattern), (match) => match[1]).filter(Boolean);

const parseSrcset = (value) =>
  value
    .split(',')
    .map((segment) => segment.trim().split(/\s+/)[0])
    .filter(Boolean);

const getPrimaryRoute = (filePath) => getHtmlRouteVariants(filePath)[0];

const isIgnorableReference = (reference) =>
  !reference ||
  reference.startsWith('data:') ||
  reference.startsWith('javascript:') ||
  reference.startsWith('mailto:') ||
  reference.startsWith('tel:');

const resolveReference = (reference, baseRoute, siteOrigin) => {
  if (reference.startsWith('#')) {
    return new URL(`${baseRoute}${reference}`, LOCAL_ORIGIN);
  }

  try {
    const url = new URL(reference, `${LOCAL_ORIGIN}${baseRoute}`);

    if (url.protocol === 'http:' || url.protocol === 'https:') {
      if (url.origin !== siteOrigin && url.origin !== LOCAL_ORIGIN) {
        return null;
      }
    }

    return url;
  } catch {
    return null;
  }
};

const buildHtmlAnalysis = (htmlFiles) => {
  const idsByRoute = new Map();
  const routeSet = new Set();

  for (const filePath of htmlFiles) {
    const html = readTextFile(resolve(DIST_DIR, filePath));
    const ids = new Set(extractMatches(ID_PATTERN, html));
    const routes = getHtmlRouteVariants(filePath);

    for (const route of routes) {
      idsByRoute.set(route, ids);
      routeSet.add(route);
    }
  }

  return { idsByRoute, routeSet };
};

const buildAssetSet = (files) =>
  new Set(
    files.filter((filePath) => !filePath.endsWith('.html')).map((filePath) => `/${filePath}`),
  );

const hasInternalPath = (pathname, routeSet, assetSet) =>
  routeSet.has(pathname) || assetSet.has(pathname);

const validatePathReference = ({
  assetSet,
  context,
  errors,
  idsByRoute,
  reference,
  routeSet,
  siteOrigin,
  sourceRoute,
}) => {
  if (isIgnorableReference(reference)) {
    return;
  }

  const resolvedUrl = resolveReference(reference, sourceRoute, siteOrigin);

  if (!resolvedUrl) {
    return;
  }

  const normalizedPath = resolvedUrl.pathname || '/';

  if (!hasInternalPath(normalizedPath, routeSet, assetSet)) {
    errors.add(`${context}: missing internal target ${reference} -> ${normalizedPath}`);
    return;
  }

  if (!resolvedUrl.hash) {
    return;
  }

  const targetId = decodeURIComponent(resolvedUrl.hash.slice(1));
  const targetIds = idsByRoute.get(normalizedPath);

  if (targetIds && !targetIds.has(targetId)) {
    errors.add(`${context}: missing anchor ${resolvedUrl.hash} on ${normalizedPath}`);
  }
};

const validateHtmlFiles = ({ assetSet, htmlFiles, idsByRoute, routeSet, siteOrigin }) => {
  const errors = new Set();

  for (const filePath of htmlFiles) {
    const html = readTextFile(resolve(DIST_DIR, filePath));
    const sourceRoute = getPrimaryRoute(filePath);
    const currentPageIds = idsByRoute.get(sourceRoute) ?? new Set();

    for (const reference of extractMatches(LINK_PATTERN, html)) {
      if (reference.startsWith('#')) {
        const targetId = decodeURIComponent(reference.slice(1));

        if (!currentPageIds.has(targetId)) {
          errors.add(`${sourceRoute}: missing anchor ${reference}`);
        }

        continue;
      }

      validatePathReference({
        assetSet,
        context: sourceRoute,
        errors,
        idsByRoute,
        reference,
        routeSet,
        siteOrigin,
        sourceRoute,
      });
    }

    for (const reference of [
      ...extractMatches(LINK_TAG_PATTERN, html),
      ...extractMatches(SCRIPT_SRC_PATTERN, html),
      ...extractMatches(IMAGE_PATTERN, html),
      ...extractMatches(SOURCE_SRC_PATTERN, html),
      ...extractMatches(META_IMAGE_PATTERN, html),
      ...extractMatches(SOURCESET_PATTERN, html).flatMap(parseSrcset),
    ]) {
      validatePathReference({
        assetSet,
        context: sourceRoute,
        errors,
        idsByRoute,
        reference,
        routeSet,
        siteOrigin,
        sourceRoute,
      });
    }
  }

  return errors;
};

const validateManifest = ({ assetSet, errors, idsByRoute, routeSet, siteOrigin }) => {
  const manifestPath = resolve(DIST_DIR, 'site.webmanifest');

  if (!existsSync(manifestPath)) {
    errors.add('/site.webmanifest: missing manifest file');
    return;
  }

  const manifest = JSON.parse(readTextFile(manifestPath));

  validatePathReference({
    assetSet,
    context: '/site.webmanifest',
    errors,
    idsByRoute,
    reference: manifest.start_url,
    routeSet,
    siteOrigin,
    sourceRoute: '/',
  });

  validatePathReference({
    assetSet,
    context: '/site.webmanifest',
    errors,
    idsByRoute,
    reference: manifest.scope,
    routeSet,
    siteOrigin,
    sourceRoute: '/',
  });

  for (const icon of manifest.icons ?? []) {
    validatePathReference({
      assetSet,
      context: '/site.webmanifest',
      errors,
      idsByRoute,
      reference: icon.src,
      routeSet,
      siteOrigin,
      sourceRoute: '/',
    });
  }
};

const validateSearchIndex = ({ routeSet, errors }) => {
  const searchIndexPath = resolve(DIST_DIR, 'search-index.json');

  if (!existsSync(searchIndexPath)) {
    errors.add('/search-index.json: missing search index');
    return;
  }

  const records = JSON.parse(readTextFile(searchIndexPath));

  for (const record of records) {
    if (!routeSet.has(record.href)) {
      errors.add(`/search-index.json: missing record target ${record.href}`);
    }

    for (const relatedLink of record.relatedLinks ?? []) {
      if (!routeSet.has(relatedLink.href)) {
        errors.add(`/search-index.json: missing related target ${relatedLink.href}`);
      }
    }
  }
};

const validateRobotsAndSitemap = ({ routeSet, errors, siteOrigin }) => {
  const robotsPath = resolve(DIST_DIR, 'robots.txt');
  const sitemapPath = resolve(DIST_DIR, 'sitemap-index.xml');

  if (!existsSync(robotsPath)) {
    errors.add('/robots.txt: missing robots.txt');
  } else {
    const robotsText = readTextFile(robotsPath);

    if (!robotsText.includes(`${siteOrigin}/sitemap-index.xml`)) {
      errors.add('/robots.txt: sitemap reference is missing or incorrect');
    }
  }

  if (!existsSync(sitemapPath)) {
    errors.add('/sitemap-index.xml: missing sitemap');
    return;
  }

  const sitemap = readTextFile(sitemapPath);
  const locationPattern = /<loc>([^<]+)<\/loc>/gi;

  for (const location of extractMatches(locationPattern, sitemap)) {
    const url = new URL(location, siteOrigin);

    if (url.origin !== siteOrigin) {
      continue;
    }

    if (!routeSet.has(url.pathname)) {
      errors.add(`/sitemap-index.xml: missing route ${url.pathname}`);
    }
  }
};

const getCompressionSummary = (files) => {
  const compressibleFiles = files.filter((filePath) => {
    if (filePath === '_headers') {
      return true;
    }

    return COMPRESSIBLE_EXTENSIONS.has(extname(filePath));
  });

  return compressibleFiles.reduce(
    (summary, filePath) => {
      const buffer = readFileSync(resolve(DIST_DIR, filePath));
      const gzipSize = gzipSync(buffer).length;
      const brotliSize = brotliCompressSync(buffer, {
        params: {
          [zlibConstants.BROTLI_PARAM_QUALITY]: 11,
        },
      }).length;

      summary.files += 1;
      summary.rawBytes += buffer.length;
      summary.gzipBytes += gzipSize;
      summary.brotliBytes += brotliSize;

      return summary;
    },
    {
      brotliBytes: 0,
      files: 0,
      gzipBytes: 0,
      rawBytes: 0,
    },
  );
};

const formatBytes = (value) => `${(value / 1024).toFixed(1)} KiB`;

const writeHeadersFile = () => {
  if (!existsSync(PUBLIC_HEADERS_PATH)) {
    fail('Expected public/_headers to exist before production hardening.');
  }

  const blocks = parseHeadersFile(readTextFile(PUBLIC_HEADERS_PATH));
  const securityHeaders = [
    `Content-Security-Policy: ${buildHeaderContentSecurityPolicy()}`,
    'Cross-Origin-Opener-Policy: same-origin',
    'Cross-Origin-Resource-Policy: same-origin',
    'Permissions-Policy: accelerometer=(), autoplay=(), camera=(), display-capture=(), fullscreen=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), publickey-credentials-get=(), usb=(), xr-spatial-tracking=()',
    'Referrer-Policy: strict-origin-when-cross-origin',
    'Strict-Transport-Security: max-age=31536000; includeSubDomains; preload',
    'X-Content-Type-Options: nosniff',
    'X-Frame-Options: DENY',
  ];

  updateRootHeaders(blocks, securityHeaders);
  const renderedHeaders = renderHeadersFile(blocks);
  validateHeadersLineLengths(renderedHeaders);
  writeFileSync(resolve(DIST_DIR, '_headers'), renderedHeaders, 'utf8');
};

const writeHtmlContentSecurityPolicies = (htmlFiles) => {
  const inlineScriptHashCount = new Set();
  let maxPolicyLength = 0;

  for (const filePath of htmlFiles) {
    const htmlPath = resolve(DIST_DIR, filePath);
    const html = readTextFile(htmlPath);
    const inlineScriptHashes = getInlineScriptHashes(html);

    for (const hash of inlineScriptHashes) {
      inlineScriptHashCount.add(hash);
    }

    const contentSecurityPolicy = buildMetaContentSecurityPolicy(inlineScriptHashes);
    maxPolicyLength = Math.max(maxPolicyLength, contentSecurityPolicy.length);

    writeFileSync(htmlPath, injectContentSecurityPolicyMeta(html, contentSecurityPolicy), 'utf8');
  }

  return {
    maxPolicyLength,
    uniqueInlineScriptHashes: inlineScriptHashCount.size,
  };
};

const main = () => {
  if (!existsSync(DIST_DIR)) {
    fail('dist/ does not exist. Run npm run build before production hardening.');
  }

  const files = walkFiles(DIST_DIR);
  const htmlFiles = files.filter((filePath) => filePath.endsWith('.html'));

  if (htmlFiles.length === 0) {
    fail('No HTML files were found in dist/.');
  }

  const cspSummary = writeHtmlContentSecurityPolicies(htmlFiles);
  writeHeadersFile();

  const { idsByRoute, routeSet } = buildHtmlAnalysis(htmlFiles);
  const assetSet = buildAssetSet(files);
  const siteOrigin = getSiteOrigin();
  const errors = new Set([
    ...validateHtmlFiles({
      assetSet,
      htmlFiles,
      idsByRoute,
      routeSet,
      siteOrigin,
    }),
  ]);

  validateManifest({ assetSet, errors, idsByRoute, routeSet, siteOrigin });
  validateSearchIndex({ errors, routeSet });
  validateRobotsAndSitemap({ errors, routeSet, siteOrigin });

  if (errors.size > 0) {
    const errorLines = Array.from(errors)
      .sort()
      .map((error) => `- ${error}`);
    fail(`Production hardening validation failed:\n${errorLines.join('\n')}`);
  }

  const compressionSummary = getCompressionSummary(walkFiles(DIST_DIR));

  console.log(
    [
      '[production-hardening] Hardened Cloudflare headers generated.',
      `[production-hardening] HTML CSP meta tags generated for ${htmlFiles.length} pages (max policy length ${cspSummary.maxPolicyLength} characters).`,
      `[production-hardening] Inline CSP hashes: ${cspSummary.uniqueInlineScriptHashes}.`,
      `[production-hardening] Validated ${htmlFiles.length} HTML pages, ${routeSet.size} routable paths, and ${assetSet.size} static assets.`,
      `[production-hardening] Compression summary: raw ${formatBytes(compressionSummary.rawBytes)}, gzip ${formatBytes(compressionSummary.gzipBytes)}, brotli ${formatBytes(compressionSummary.brotliBytes)} across ${compressionSummary.files} text assets.`,
    ].join('\n'),
  );
};

try {
  main();
} catch (error) {
  console.error(
    error instanceof Error ? error.message : '[production-hardening] Unknown validation failure.',
  );
  process.exitCode = 1;
}
