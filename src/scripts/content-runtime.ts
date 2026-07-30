import { getMermaidConfig } from '@config/mermaid';

interface MarkdownEnhancementConfig {
  codeCopiedLabel: string;
  codeCopyLabel: string;
  mermaidTitle: string;
}

type BrowserWindow = Window & {
  __ptkpMermaidLoader?: Promise<MermaidRuntime>;
  __ptkpMermaidTheme?: 'light' | 'dark';
  __ptkpMermaidThemeBound?: boolean;
  __ptkpReadingProgressBound?: boolean;
};

type MermaidRenderResult = {
  bindFunctions?: (element: Element) => void;
  svg: string;
};

type MermaidRuntime = {
  initialize: (config: ReturnType<typeof getMermaidConfig>) => void;
  render: (id: string, text: string, container?: Element) => Promise<MermaidRenderResult>;
  run: (options: { nodes: HTMLElement[] }) => Promise<void>;
};
type ResolvedTheme = 'light' | 'dark';

let mermaidRenderCount = 0;

const getResolvedTheme = (): ResolvedTheme =>
  document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';

const getConfig = (): MarkdownEnhancementConfig => {
  const config = document.querySelector<HTMLElement>('[data-markdown-enhancements]');

  return {
    codeCopiedLabel: config?.dataset.codeCopiedLabel ?? 'Copied',
    codeCopyLabel: config?.dataset.codeCopyLabel ?? 'Copy',
    mermaidTitle: config?.dataset.mermaidTitle ?? 'Mermaid diagram',
  };
};

const isReducedMotionPreferred = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const getCodeText = (pre: HTMLPreElement): string =>
  pre.querySelector('code')?.textContent ?? pre.textContent ?? '';

const getCodeLanguage = (pre: HTMLPreElement): string => {
  const explicitLanguage = pre.dataset.language?.trim();

  if (explicitLanguage) {
    return explicitLanguage;
  }

  const code = pre.querySelector('code');
  const languageClass = Array.from(code?.classList ?? []).find((className) =>
    className.startsWith('language-'),
  );

  return languageClass?.replace('language-', '').trim() ?? 'text';
};

const formatLanguageLabel = (language: string): string =>
  language
    .split(/[-_]/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');

const getFilename = (pre: HTMLPreElement): string | null =>
  pre.dataset.filename?.trim() || pre.dataset.file?.trim() || null;

const getHighlightLines = (pre: HTMLPreElement): number[] => {
  const rawValue = pre.dataset.highlightLines?.trim() || pre.dataset.highlight?.trim();

  if (!rawValue) {
    return [];
  }

  return rawValue
    .split(',')
    .flatMap((segment) => {
      const [startText, endText] = segment.trim().split('-');
      const start = Number.parseInt(startText ?? '', 10);
      const end = Number.parseInt(endText ?? '', 10);

      if (Number.isNaN(start)) {
        return [];
      }

      if (Number.isNaN(end) || end <= start) {
        return [start];
      }

      return Array.from({ length: end - start + 1 }, (_, index) => start + index);
    })
    .filter((lineNumber) => Number.isFinite(lineNumber) && lineNumber > 0);
};

const isMermaidPre = (pre: HTMLPreElement): boolean => {
  const code = pre.querySelector('code');
  const languageClass = Array.from(code?.classList ?? []).find((className) =>
    className.includes('language-mermaid'),
  );

  return (
    pre.dataset.diagram === 'mermaid' ||
    pre.dataset.language === 'mermaid' ||
    Boolean(languageClass)
  );
};

const getMermaid = async () => {
  const browserWindow = window as BrowserWindow;
  const resolvedTheme = getResolvedTheme();

  browserWindow.__ptkpMermaidLoader ??= import('mermaid/dist/mermaid.esm.mjs')
    .then((module) => module.default as MermaidRuntime)
    .catch((error) => {
      delete browserWindow.__ptkpMermaidLoader;
      throw error;
    });

  const mermaid = await browserWindow.__ptkpMermaidLoader;

  if (browserWindow.__ptkpMermaidTheme !== resolvedTheme) {
    mermaid.initialize(getMermaidConfig(resolvedTheme));
    browserWindow.__ptkpMermaidTheme = resolvedTheme;
  }

  return mermaid;
};

const renderMermaidSvg = async (definition: string): Promise<MermaidRenderResult> => {
  const mermaid = await getMermaid();
  mermaidRenderCount += 1;

  const renderResult = await mermaid.render(`ptkp-mermaid-${mermaidRenderCount}`, definition);

  if (!renderResult.svg) {
    throw new Error('Mermaid did not produce an SVG output.');
  }

  return renderResult;
};

const renderMermaidCodeBlock = async (pre: HTMLPreElement): Promise<void> => {
  if (pre.dataset.mermaidRendered === 'true' || pre.dataset.mermaidPending === 'true') {
    return;
  }

  const definition = getCodeText(pre).trim();

  if (!definition) {
    return;
  }

  pre.dataset.mermaidPending = 'true';

  const { mermaidTitle } = getConfig();
  const figure = document.createElement('figure');
  const caption = document.createElement('figcaption');
  const title = document.createElement('span');
  const canvas = document.createElement('div');
  const source = pre.cloneNode(true) as HTMLPreElement;
  const sourceHint = document.createElement('p');

  figure.className = 'mermaid-diagram knowledge-mermaid-diagram';
  figure.dataset.mermaidDiagram = '';
  figure.dataset.mermaidRendered = 'true';
  caption.className = 'mermaid-diagram__caption';
  title.className = 'mermaid-diagram__title';
  title.textContent = mermaidTitle;
  canvas.className = 'mermaid-diagram__canvas';
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', mermaidTitle);
  source.classList.add('mermaid-diagram__source');
  source.setAttribute('hidden', '');
  delete source.dataset.mermaidPending;
  delete source.dataset.mermaidObserved;
  delete source.dataset.mermaidRendered;
  delete source.dataset.mermaidError;
  sourceHint.className = 'sr-only';
  sourceHint.textContent = 'Scrollable diagram source. Scroll horizontally to review all code.';

  try {
    const { bindFunctions, svg } = await renderMermaidSvg(definition);

    canvas.innerHTML = svg;
    bindFunctions?.(canvas);
    caption.append(title);
    figure.append(caption, sourceHint, source, canvas);
    pre.dataset.mermaidRendered = 'true';
    pre.replaceWith(figure);
  } catch (error) {
    pre.dataset.mermaidError = 'true';
    console.error('PTKP Mermaid render failed for markdown code block.', error);
  } finally {
    delete pre.dataset.mermaidPending;
  }
};

const renderMermaidDiagramComponent = async (diagram: HTMLElement): Promise<void> => {
  if (diagram.dataset.mermaidRendered === 'true' || diagram.dataset.mermaidPending === 'true') {
    return;
  }

  const source = diagram.querySelector<HTMLPreElement>('[data-mermaid-source]');
  const canvas = diagram.querySelector<HTMLElement>('[data-mermaid-canvas]');
  const definition = source?.textContent?.trim();

  if (!source || !canvas || !definition) {
    return;
  }

  diagram.dataset.mermaidPending = 'true';

  try {
    const { bindFunctions, svg } = await renderMermaidSvg(definition);

    canvas.innerHTML = svg;
    bindFunctions?.(canvas);
    canvas.removeAttribute('hidden');
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', diagram.dataset.mermaidTitle ?? 'Mermaid diagram');
    source.setAttribute('hidden', '');
    diagram.dataset.mermaidRendered = 'true';
  } catch (error) {
    diagram.dataset.mermaidError = 'true';
    console.error('PTKP Mermaid render failed for diagram component.', error);
  } finally {
    delete diagram.dataset.mermaidPending;
  }
};

const renderMermaidTarget = (target: HTMLElement): void => {
  if (target.matches('[data-mermaid-diagram]')) {
    void renderMermaidDiagramComponent(target);
    return;
  }

  if (target instanceof HTMLPreElement) {
    void renderMermaidCodeBlock(target);
  }
};

const rerenderMermaidDiagrams = (): void => {
  document.querySelectorAll<HTMLElement>('[data-mermaid-diagram]').forEach((diagram) => {
    const canvas = diagram.querySelector<HTMLElement>('[data-mermaid-canvas]');
    const source = diagram.querySelector<HTMLPreElement>('[data-mermaid-source]');

    delete diagram.dataset.mermaidRendered;
    delete diagram.dataset.mermaidPending;
    delete diagram.dataset.mermaidError;
    delete diagram.dataset.mermaidObserved;

    if (canvas) {
      canvas.innerHTML = '';
      canvas.setAttribute('hidden', '');
    }

    if (source) {
      source.removeAttribute('hidden');
    }

    renderMermaidTarget(diagram);
  });
};

const bindMermaidThemeUpdates = (): void => {
  const browserWindow = window as BrowserWindow;

  if (browserWindow.__ptkpMermaidThemeBound === true) {
    return;
  }

  browserWindow.__ptkpMermaidThemeBound = true;
  document.addEventListener('ptkp:theme-change', () => {
    rerenderMermaidDiagrams();
  });
};

const observeMermaidTargets = (): void => {
  const targets: HTMLElement[] = [
    ...Array.from(
      document.querySelectorAll<HTMLElement>(
        '[data-mermaid-diagram]:not([data-mermaid-rendered="true"])',
      ),
    ),
    ...Array.from(document.querySelectorAll<HTMLPreElement>('.knowledge-content pre')).filter(
      (pre) => isMermaidPre(pre) && pre.dataset.mermaidRendered !== 'true',
    ),
  ];

  if (targets.length === 0) {
    return;
  }

  targets.forEach((target) => {
    if (target.dataset.mermaidObserved === 'true') {
      return;
    }

    target.dataset.mermaidObserved = 'true';
    renderMermaidTarget(target);
  });
};

const initStandaloneCopyButtons = (): void => {
  const getTextToCopy = (button: HTMLButtonElement): string => {
    if (button.dataset.copyText) {
      return button.dataset.copyText;
    }

    const targetId = button.dataset.copyTarget;
    const target = targetId ? document.getElementById(targetId) : undefined;

    return target?.textContent?.trimEnd() ?? '';
  };

  document.querySelectorAll<HTMLButtonElement>('[data-copy-button]').forEach((button) => {
    if (button.dataset.copyReady === 'true') {
      return;
    }

    button.dataset.copyReady = 'true';

    button.addEventListener('click', async () => {
      const textToCopy = getTextToCopy(button);
      const label = button.querySelector<HTMLElement>('[data-copy-button-label]');
      const status = button.nextElementSibling?.matches('[data-copy-button-status]')
        ? (button.nextElementSibling as HTMLElement)
        : undefined;
      const defaultLabel = button.dataset.copyLabel ?? 'Copy';
      const copiedLabel = button.dataset.copyCopiedLabel ?? 'Copied';

      if (!textToCopy) {
        if (status) {
          status.textContent = 'Nothing to copy.';
        }
        return;
      }

      try {
        await navigator.clipboard.writeText(textToCopy);

        if (label) {
          label.textContent = copiedLabel;
        }

        if (status) {
          status.textContent = copiedLabel;
        }

        window.setTimeout(() => {
          if (label) {
            label.textContent = defaultLabel;
          }

          if (status) {
            status.textContent = '';
          }
        }, 1800);
      } catch {
        if (status) {
          status.textContent = 'Copy unavailable.';
        }
      }
    });
  });
};

const enhanceCodeCopy = (): void => {
  const { codeCopiedLabel, codeCopyLabel } = getConfig();
  const codeBlocks = document.querySelectorAll<HTMLPreElement>('.knowledge-content pre');

  codeBlocks.forEach((pre, index) => {
    if (
      pre.dataset.copyEnhanced === 'true' ||
      pre.closest('.code-block, .knowledge-code-wrapper') ||
      isMermaidPre(pre)
    ) {
      return;
    }

    const code = getCodeText(pre).trim();

    if (!code) {
      return;
    }

    const wrapper = document.createElement('div');
    const header = document.createElement('div');
    const meta = document.createElement('div');
    const languageLabel = document.createElement('span');
    const button = document.createElement('button');
    const status = document.createElement('span');
    const codeId = pre.id || `knowledge-code-${index}`;
    const fileName = getFilename(pre);
    const highlightLines = new Set(getHighlightLines(pre));
    const codeLines = pre.querySelectorAll<HTMLElement>('code > .line');

    pre.id = codeId;
    pre.tabIndex = pre.tabIndex >= 0 ? pre.tabIndex : 0;
    pre.dataset.copyEnhanced = 'true';
    wrapper.className = 'knowledge-code-wrapper';
    header.className = 'code-block__header';
    meta.className = 'code-block__meta';
    languageLabel.className = 'code-block__language';
    languageLabel.textContent = formatLanguageLabel(getCodeLanguage(pre));
    button.type = 'button';
    button.className = 'copy-button knowledge-code-copy';
    button.textContent = codeCopyLabel;
    button.setAttribute('aria-label', `${codeCopyLabel} code block`);
    button.setAttribute('aria-controls', codeId);
    status.className = 'sr-only';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');

    if (fileName) {
      const fileLabel = document.createElement('span');
      fileLabel.className = 'code-block__file';
      fileLabel.textContent = fileName;
      meta.appendChild(fileLabel);
    }

    meta.appendChild(languageLabel);

    if (highlightLines.size > 0 && codeLines.length > 0) {
      codeLines.forEach((line, lineIndex) => {
        if (highlightLines.has(lineIndex + 1)) {
          line.classList.add('code-line--highlighted');
        }
      });
    }

    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code);
        button.textContent = codeCopiedLabel;
        status.textContent = codeCopiedLabel;
        window.setTimeout(() => {
          button.textContent = codeCopyLabel;
          status.textContent = '';
        }, 1800);
      } catch {
        button.textContent = codeCopyLabel;
        status.textContent = 'Copy unavailable.';
      }
    });

    pre.before(wrapper);
    header.append(meta, button, status);
    wrapper.append(header, pre);
  });
};

const createAnchorLink = (id: string): HTMLAnchorElement => {
  const anchor = document.createElement('a');
  anchor.href = `#${id}`;
  anchor.className = 'heading-anchor';
  anchor.setAttribute('aria-label', 'Copy link to this heading');
  anchor.textContent = '#';

  anchor.addEventListener('click', () => {
    const url = new URL(window.location.toString());
    url.hash = id;
    navigator.clipboard.writeText(url.toString()).catch(() => undefined);
  });

  return anchor;
};

const enhanceHeadingAnchors = (): void => {
  const headings = document.querySelectorAll<HTMLHeadingElement>(
    '.knowledge-content h2, .knowledge-content h3, .knowledge-content h4',
  );

  headings.forEach((heading) => {
    if (heading.id && !heading.querySelector('.heading-anchor')) {
      heading.appendChild(createAnchorLink(heading.id));
    }
  });
};

const enhanceExternalLinks = (): void => {
  const links = document.querySelectorAll<HTMLAnchorElement>('.knowledge-content a');

  links.forEach((link) => {
    const href = link.getAttribute('href');

    if (!href) {
      return;
    }

    const resolvedUrl = new URL(href, window.location.origin);
    const isExternal =
      !href.startsWith('#') &&
      !href.startsWith('/') &&
      !resolvedUrl.href.startsWith(window.location.origin);

    if (!isExternal) {
      return;
    }

    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    if (!link.classList.contains('external-link')) {
      link.classList.add('external-link');
    }

    const linkText = link.textContent?.trim() || 'External link';
    link.setAttribute('aria-label', `${linkText} (opens in new tab)`);
  });
};

const updateReadingProgress = (): void => {
  const progressBar = document.getElementById('reading-progress');
  const content = document.querySelector('.knowledge-content');

  if (!progressBar || !content) {
    return;
  }

  const contentTop = content.getBoundingClientRect().top;
  const contentHeight = content.getBoundingClientRect().height;
  const windowHeight = window.innerHeight;

  let progress = 0;

  if (contentHeight > 0) {
    progress = Math.max(0, Math.min(100, ((-contentTop + windowHeight) / contentHeight) * 100));
  }

  progressBar.style.width = `${progress}%`;
};

const setupReadingProgress = (): void => {
  const browserWindow = window as BrowserWindow;

  if (browserWindow.__ptkpReadingProgressBound !== true) {
    browserWindow.__ptkpReadingProgressBound = true;
    window.addEventListener('scroll', updateReadingProgress, { passive: true });
    window.addEventListener('resize', updateReadingProgress, { passive: true });
  }

  updateReadingProgress();
};

const enhanceBlockquotes = (): void => {
  const blockquotes = document.querySelectorAll<HTMLQuoteElement>('.knowledge-content blockquote');

  blockquotes.forEach((blockquote) => {
    if (!blockquote.classList.contains('blockquote-enhanced')) {
      blockquote.classList.add('blockquote-enhanced');
    }
  });
};

const enhanceImages = (): void => {
  const images = document.querySelectorAll<HTMLImageElement>(
    '.knowledge-content img:not(.image-enhanced)',
  );

  images.forEach((img) => {
    img.loading = img.loading || 'lazy';
    img.decoding = img.decoding || 'async';
    img.classList.add('image-enhanced');

    if (!img.alt || img.parentElement?.tagName === 'FIGURE') {
      return;
    }

    const figcaption = document.createElement('figcaption');
    figcaption.className = 'image-caption';
    figcaption.textContent = img.alt;

    const figure = document.createElement('figure');
    figure.className = 'image-figure';
    img.parentNode?.insertBefore(figure, img);
    figure.appendChild(img);
    figure.appendChild(figcaption);
  });
};

const enhanceTables = (): void => {
  const applyHeaderScopes = (table: HTMLTableElement): void => {
    const headHeaders = Array.from(table.querySelectorAll<HTMLTableCellElement>('thead th'));

    if (headHeaders.length > 0) {
      headHeaders.forEach((header) => {
        if (!header.scope) {
          header.scope = 'col';
        }
      });

      table.querySelectorAll<HTMLTableCellElement>('tbody th').forEach((header) => {
        if (!header.scope) {
          header.scope = 'row';
        }
      });

      return;
    }

    table.querySelectorAll<HTMLTableCellElement>('tr:first-child > th').forEach((header) => {
      if (!header.scope) {
        header.scope = 'col';
      }
    });

    table.querySelectorAll<HTMLTableCellElement>('tr:not(:first-child) > th').forEach((header) => {
      if (!header.scope) {
        header.scope = 'row';
      }
    });
  };

  document
    .querySelectorAll<HTMLTableElement>('.knowledge-content table')
    .forEach((table, index) => {
      applyHeaderScopes(table);

      if (table.dataset.tableEnhanced === 'true') {
        return;
      }

      table.dataset.tableEnhanced = 'true';

      const existingWrapper = table.closest<HTMLElement>('.data-table__scroll');

      if (existingWrapper) {
        return;
      }

      const wrapper = document.createElement('div');

      wrapper.className = 'data-table__scroll';
      wrapper.tabIndex = 0;
      wrapper.setAttribute('role', 'region');
      wrapper.setAttribute('aria-label', `Scrollable data table ${index + 1}`);
      table.before(wrapper);
      wrapper.appendChild(table);
    });
};

const initTableOfContents = (): void => {
  const toc = document.querySelector<HTMLElement>('[data-toc]');

  if (!toc || toc.dataset.tocInitialized === 'true') {
    return;
  }

  const links = Array.from(toc.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));

  if (links.length === 0) {
    return;
  }

  const headings = links
    .map((link) => document.getElementById(link.hash.slice(1)))
    .filter((heading): heading is HTMLElement => Boolean(heading));

  if (headings.length === 0) {
    return;
  }

  toc.dataset.tocInitialized = 'true';

  const setActiveLink = (activeId: string | null): void => {
    links.forEach((link) => {
      const active = link.getAttribute('href') === `#${activeId}`;
      link.classList.toggle('is-active', active);
      if (active) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const focusHeading = (heading: HTMLElement): void => {
    if (!heading.hasAttribute('tabindex')) {
      heading.setAttribute('tabindex', '-1');
    }

    heading.focus({ preventScroll: true });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

      if (visibleEntry) {
        setActiveLink(visibleEntry.target.id);
      }
    },
    {
      rootMargin: '-20% 0px -70% 0px',
      threshold: [0.08, 0.25, 0.45],
    },
  );

  headings.forEach((heading) => observer.observe(heading));
  links.forEach((link) => {
    link.addEventListener('click', () => {
      const heading = document.getElementById(link.hash.slice(1));

      if (!heading) {
        return;
      }

      if (isReducedMotionPreferred()) {
        window.setTimeout(() => focusHeading(heading), 0);
        return;
      }

      window.requestAnimationFrame(() => focusHeading(heading));
    });
  });

  setActiveLink(headings[0]?.id ?? null);
};

const initContentRuntime = (): void => {
  bindMermaidThemeUpdates();
  observeMermaidTargets();
  initStandaloneCopyButtons();
  enhanceCodeCopy();
  enhanceHeadingAnchors();
  enhanceExternalLinks();
  enhanceBlockquotes();
  enhanceImages();
  enhanceTables();
  initTableOfContents();
  setupReadingProgress();
};

initContentRuntime();
document.addEventListener('astro:page-load', initContentRuntime);
