import type { APIRoute } from 'astro';

import { siteConfig } from '@config/site';
import { getPublishedCollectionEntries } from '@lib/content/queries';
import { getEntryUrl } from '@lib/content/relationships';

export const prerender = true;

const escapeXml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const resolveUrl = (path: string): string => new URL(path, siteConfig.url).toString();

export const GET: APIRoute = async () => {
  const [articles, labNotes, architectureGuides, caseStudies] = await Promise.all([
    getPublishedCollectionEntries('articles'),
    getPublishedCollectionEntries('lab-notes'),
    getPublishedCollectionEntries('architecture-guides'),
    getPublishedCollectionEntries('case-studies'),
  ]);

  const items = [...articles, ...labNotes, ...architectureGuides, ...caseStudies]
    .sort((first, second) => second.data.updatedDate.getTime() - first.data.updatedDate.getTime())
    .slice(0, 20);

  const lastBuildDate = items[0]?.data.updatedDate ?? new Date();
  const rssItems = items
    .map((entry) => {
      const href = resolveUrl(getEntryUrl(entry));

      return `  <item>
    <title>${escapeXml(entry.data.title)}</title>
    <link>${escapeXml(href)}</link>
    <guid>${escapeXml(href)}</guid>
    <pubDate>${entry.data.publishedDate.toUTCString()}</pubDate>
    <dc:date>${entry.data.updatedDate.toISOString()}</dc:date>
    <description>${escapeXml(entry.data.summary)}</description>
  </item>`;
    })
    .join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(siteConfig.fullName)}</title>
    <link>${escapeXml(siteConfig.url)}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>${siteConfig.language}</language>
    <lastBuildDate>${lastBuildDate.toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(resolveUrl('/rss.xml'))}" rel="self" type="application/rss+xml" />
${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
