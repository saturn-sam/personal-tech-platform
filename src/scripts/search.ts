import {
  getSearchCategoryOptions,
  getSearchCollectionOptions,
  normalizeSearchPayload,
  searchRecords,
  type SearchRecord,
  type SearchSort,
} from '@lib/search';

interface SearchSurfaceElements {
  root: HTMLElement;
  form: HTMLFormElement;
  input: HTMLInputElement;
  status: HTMLElement;
  results: HTMLElement;
  history: HTMLElement;
  clearInput: HTMLButtonElement;
  clearHistory: HTMLButtonElement;
  collectionFilter: HTMLSelectElement;
  categoryFilter: HTMLSelectElement;
  sortSelect: HTMLSelectElement;
}

const SEARCH_OPEN_EVENT = 'ptkp:search-open';
const RECENT_SEARCHES_KEY = 'ptkp-recent-searches';
const SEARCH_INDEX_ENDPOINT = '/search-index.json';

let dialogPreviousFocus: HTMLElement | null = null;

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const highlightText = (value: string, query: string): string => {
  const terms = query.trim().split(/\s+/).filter(Boolean);

  if (!terms.length) {
    return escapeHtml(value);
  }

  let highlighted = escapeHtml(value);

  terms.forEach((term) => {
    const pattern = new RegExp(`(${escapeRegExp(term)})`, 'ig');
    highlighted = highlighted.replace(pattern, '<mark>$1</mark>');
  });

  return highlighted;
};

const readRecentSearches = (): string[] => {
  try {
    const value = window.localStorage.getItem(RECENT_SEARCHES_KEY);
    const parsed = value ? JSON.parse(value) : [];

    return Array.isArray(parsed)
      ? parsed.filter((entry): entry is string => typeof entry === 'string')
      : [];
  } catch {
    return [];
  }
};

const saveRecentSearches = (value: string[]): void => {
  try {
    window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(value.slice(0, 10)));
  } catch {
    // Ignore storage errors.
  }
};

const createSnippet = (record: SearchRecord, query: string): string => {
  if (!query.trim()) {
    return record.summary || record.description || '';
  }

  const source = [record.summary, record.description, record.body].filter(Boolean).join(' ');
  const normalizedSource = source.replace(/\s+/g, ' ').trim();

  if (!normalizedSource) {
    return '';
  }

  const lowerSource = normalizedSource.toLowerCase();
  const terms = query
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((term) => term.toLowerCase());
  const bestIndex = terms.reduce((currentBest, term) => {
    const index = lowerSource.indexOf(term);

    if (index === -1) {
      return currentBest;
    }

    return currentBest === -1 ? index : Math.min(currentBest, index);
  }, -1);

  if (bestIndex === -1) {
    return record.summary || record.description || '';
  }

  const start = Math.max(0, bestIndex - 70);
  const end = Math.min(normalizedSource.length, bestIndex + 150);
  let snippet = normalizedSource.slice(start, end).trim();

  if (start > 0) {
    snippet = `...${snippet}`;
  }

  if (end < normalizedSource.length) {
    snippet = `${snippet}...`;
  }

  return snippet;
};

const createChip = (value: string): HTMLSpanElement => {
  const chip = document.createElement('span');
  chip.className = 'search-page__result-chip';
  chip.textContent = value;
  return chip;
};

const createResultCard = (record: SearchRecord, query: string): HTMLElement => {
  const card = document.createElement('article');
  card.className = 'search-page__result-card';

  const heading = document.createElement('header');
  heading.className = 'search-page__result-heading';

  const title = document.createElement('h3');
  title.className = 'search-page__result-title';
  title.innerHTML = `<a href="${record.href}" data-search-result-link>${highlightText(record.title, query)}</a>`;

  const metadata = document.createElement('div');
  metadata.className = 'search-page__result-metadata';

  const type = document.createElement('p');
  type.className = 'search-page__result-type';
  type.textContent = record.typeLabel;
  metadata.appendChild(type);

  if (record.readingTimeText) {
    const readingTime = document.createElement('p');
    readingTime.className = 'search-page__result-reading-time';
    readingTime.textContent = record.readingTimeText;
    metadata.appendChild(readingTime);
  }

  const description = document.createElement('p');
  description.className = 'search-page__result-description';
  description.innerHTML = highlightText(record.summary || record.description, query);

  const breadcrumb = document.createElement('p');
  breadcrumb.className = 'search-page__result-breadcrumb';
  breadcrumb.innerHTML = highlightText(record.breadcrumb.join(' / '), query);

  const snippet = document.createElement('p');
  snippet.className = 'search-page__result-snippet';
  snippet.innerHTML = highlightText(createSnippet(record, query), query);

  const meta = document.createElement('div');
  meta.className = 'search-page__result-meta';

  const chips = [...record.categories, ...record.technologies].slice(0, 4);
  if (chips.length > 0) {
    const chipList = document.createElement('div');
    chipList.className = 'search-page__result-tags';
    chips.forEach((chip) => chipList.appendChild(createChip(chip)));
    meta.appendChild(chipList);
  }

  if (record.relatedLinks.length > 0) {
    const related = document.createElement('div');
    related.className = 'search-page__related';

    const label = document.createElement('p');
    label.className = 'search-page__related-label';
    label.textContent = 'Related';

    const links = document.createElement('div');
    links.className = 'search-page__related-links';

    record.relatedLinks.forEach((link) => {
      const anchor = document.createElement('a');
      anchor.className = 'search-page__related-link';
      anchor.href = link.href;
      anchor.textContent = link.title;
      anchor.setAttribute('data-search-result-link', '');
      links.appendChild(anchor);
    });

    related.append(label, links);
    meta.appendChild(related);
  }

  const href = document.createElement('p');
  href.className = 'search-page__result-url';
  href.textContent = record.href;

  heading.append(title, metadata);
  card.append(heading, description, breadcrumb, snippet, meta, href);
  return card;
};

const renderHistory = (surface: SearchSurfaceElements, recentSearches: string[]): void => {
  if (!recentSearches.length) {
    surface.history.hidden = true;
    surface.history.innerHTML = '';
    return;
  }

  surface.history.hidden = false;
  surface.history.innerHTML = `
    <div class="search-page__history-list">
      ${recentSearches
        .map((entry) => {
          const safeText = escapeHtml(entry);
          return `<button class="search-page__history-item" type="button" data-recent-search="${safeText}">${safeText}</button>`;
        })
        .join('')}
    </div>
  `;
};

const createFallbackEmptyState = (title: string, description: string): HTMLElement => {
  const empty = document.createElement('div');
  empty.className = 'search-page__empty-state';
  empty.innerHTML = `
    <section class="empty-state" aria-labelledby="search-empty-state-title">
      <div class="empty-state__body">
        <h2 class="empty-state__title" id="search-empty-state-title">${escapeHtml(title)}</h2>
        <p class="empty-state__description">${escapeHtml(description)}</p>
      </div>
    </section>
  `;
  return empty;
};

const createEmptyState = (
  surface: SearchSurfaceElements,
  key: 'initial' | 'no-results',
  fallbackTitle: string,
  fallbackDescription: string,
): Node => {
  const template = surface.root.querySelector<HTMLTemplateElement>(
    `[data-search-empty-state="${key}"]`,
  );
  const fragment = template?.content.cloneNode(true);

  if (fragment instanceof DocumentFragment && fragment.childElementCount > 0) {
    return fragment;
  }

  return createFallbackEmptyState(fallbackTitle, fallbackDescription);
};

const renderResults = (
  surface: SearchSurfaceElements,
  records: SearchRecord[],
  query: string,
  recentSearches: string[],
): void => {
  surface.results.replaceChildren();

  if (!query.trim()) {
    renderHistory(surface, recentSearches);

    if (!records.length) {
      surface.results.appendChild(
        createEmptyState(
          surface,
          'initial',
          'Start with a keyword',
          'Search for a topic, category, technology, or tag to discover the right knowledge asset.',
        ),
      );
      return;
    }
  } else {
    renderHistory(surface, []);
  }

  if (!records.length) {
    surface.results.appendChild(
      createEmptyState(
        surface,
        'no-results',
        'No results found',
        'Try a broader keyword, remove a filter, or continue from a published section instead.',
      ),
    );
    return;
  }

  const groupedResults = new Map<string, SearchRecord[]>();
  records.forEach((record) => {
    const group = groupedResults.get(record.collectionLabel) ?? [];
    group.push(record);
    groupedResults.set(record.collectionLabel, group);
  });

  const list = document.createElement('div');
  list.className = 'search-page__result-list';

  groupedResults.forEach((items, collectionLabel) => {
    const section = document.createElement('section');
    section.className = 'search-page__result-group';

    const heading = document.createElement('h2');
    heading.className = 'search-page__result-group-title';
    heading.textContent = collectionLabel;

    const cards = document.createElement('div');
    cards.className = 'search-page__result-list';

    items.forEach((record) => cards.appendChild(createResultCard(record, query)));
    section.append(heading, cards);
    list.appendChild(section);
  });

  surface.results.appendChild(list);
};

const updateRecentSearches = (value: string, recentSearches: string[]): string[] => {
  const normalized = value.trim();

  if (!normalized) {
    return recentSearches;
  }

  const nextEntries = [normalized, ...recentSearches.filter((entry) => entry !== normalized)].slice(
    0,
    10,
  );
  saveRecentSearches(nextEntries);
  return nextEntries;
};

const focusResultLink = (surface: SearchSurfaceElements, direction: 1 | -1): void => {
  const links = Array.from(
    surface.results.querySelectorAll<HTMLAnchorElement>('[data-search-result-link]'),
  );

  if (!links.length) {
    return;
  }

  const currentIndex = links.findIndex((link) => link === document.activeElement);
  const nextIndex =
    currentIndex >= 0
      ? (currentIndex + direction + links.length) % links.length
      : direction > 0
        ? 0
        : links.length - 1;

  links[nextIndex]?.focus();
};

const populateCollectionOptions = (
  surface: SearchSurfaceElements,
  records: readonly SearchRecord[],
): void => {
  const currentValue = surface.collectionFilter.value;
  const options = getSearchCollectionOptions(records);

  surface.collectionFilter.innerHTML = '<option value="">All types</option>';
  options.forEach((option) => {
    const element = document.createElement('option');
    element.value = option.value;
    element.textContent = option.label;
    surface.collectionFilter.appendChild(element);
  });

  surface.collectionFilter.value = options.some((option) => option.value === currentValue)
    ? currentValue
    : '';
};

const populateCategoryOptions = (
  surface: SearchSurfaceElements,
  records: readonly SearchRecord[],
): void => {
  const currentValue = surface.categoryFilter.value;
  const collection = surface.collectionFilter.value;
  const filteredRecords = collection
    ? records.filter((record) => record.collection === collection)
    : records;
  const options = getSearchCategoryOptions(filteredRecords);

  surface.categoryFilter.innerHTML = '<option value="">All categories</option>';
  options.forEach((option) => {
    const element = document.createElement('option');
    element.value = option;
    element.textContent = option;
    surface.categoryFilter.appendChild(element);
  });

  surface.categoryFilter.value = options.includes(currentValue) ? currentValue : '';
};

const getPageSearchState = () => {
  const url = new URL(window.location.href);

  return {
    category: url.searchParams.get('category') ?? '',
    collection: url.searchParams.get('type') ?? '',
    query: url.searchParams.get('q') ?? '',
    sort: (url.searchParams.get('sort') as SearchSort | null) ?? 'relevance',
  };
};

const updatePageSearchUrl = (
  query: string,
  collection: string,
  category: string,
  sort: SearchSort,
): void => {
  const url = new URL(window.location.href);

  if (query) {
    url.searchParams.set('q', query);
  } else {
    url.searchParams.delete('q');
  }

  if (collection) {
    url.searchParams.set('type', collection);
  } else {
    url.searchParams.delete('type');
  }

  if (category) {
    url.searchParams.set('category', category);
  } else {
    url.searchParams.delete('category');
  }

  if (sort !== 'relevance') {
    url.searchParams.set('sort', sort);
  } else {
    url.searchParams.delete('sort');
  }

  window.history.replaceState({}, '', url);
};

const getResultSummary = (
  query: string,
  count: number,
  collectionLabel: string,
  category: string,
): string => {
  if (!query.trim()) {
    return count > 0
      ? `Showing ${count} featured result${count === 1 ? '' : 's'} across the platform.`
      : 'Search across articles, lab notes, architecture guides, case studies, projects, technologies, certifications, resources, and learning paths.';
  }

  const scope = [collectionLabel, category].filter(Boolean).join(' / ');

  if (scope) {
    return `Showing ${count} result${count === 1 ? '' : 's'} in ${scope} for "${query}".`;
  }

  return `Showing ${count} result${count === 1 ? '' : 's'} for "${query}".`;
};

const getDialogSurface = (): HTMLElement | null =>
  document.querySelector<HTMLElement>('[data-search-dialog]');

const getDialogBackdrop = (): HTMLElement | null =>
  document.querySelector<HTMLElement>('[data-search-backdrop]');

const syncDialogTriggerState = (isOpen: boolean): void => {
  document.querySelectorAll<HTMLElement>('[data-search-open]').forEach((trigger) => {
    trigger.setAttribute('aria-expanded', String(isOpen));
  });
};

const openDialog = (): void => {
  const dialog = getDialogSurface();
  const backdrop = getDialogBackdrop();

  if (!dialog || !backdrop) {
    return;
  }

  dialogPreviousFocus =
    document.activeElement instanceof HTMLElement ? document.activeElement : null;
  dialog.hidden = false;
  backdrop.hidden = false;
  syncDialogTriggerState(true);
  dialog.querySelector<HTMLInputElement>('[data-search-input]')?.focus();
};

const closeDialog = (): void => {
  const dialog = getDialogSurface();
  const backdrop = getDialogBackdrop();

  if (!dialog || !backdrop) {
    return;
  }

  dialog.hidden = true;
  backdrop.hidden = true;
  syncDialogTriggerState(false);
  dialogPreviousFocus?.focus();
  dialogPreviousFocus = null;
};

const trapDialogFocus = (event: KeyboardEvent, dialog: HTMLElement): void => {
  if (event.key !== 'Tab') {
    return;
  }

  const focusableElements = Array.from(
    dialog.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (!firstElement || !lastElement) {
    return;
  }

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
};

const wireSurface = async (
  surface: SearchSurfaceElements,
  records: SearchRecord[],
): Promise<void> => {
  if (surface.root.dataset.initialized === 'true') {
    return;
  }

  surface.root.dataset.initialized = 'true';

  const isPageSurface = surface.root.dataset.searchSurface === 'page';
  const initialState = isPageSurface
    ? getPageSearchState()
    : {
        category: '',
        collection: '',
        query: '',
        sort: 'relevance' as SearchSort,
      };
  let recentSearches = readRecentSearches();

  populateCollectionOptions(surface, records);
  surface.collectionFilter.value = initialState.collection;
  populateCategoryOptions(surface, records);
  surface.categoryFilter.value = initialState.category;
  surface.sortSelect.value = initialState.sort;
  surface.input.value = initialState.query || surface.input.value;

  const runSearch = (): void => {
    const query = surface.input.value.trim();
    const collection = surface.collectionFilter.value;
    const category = surface.categoryFilter.value;
    const sort = (surface.sortSelect.value || 'relevance') as SearchSort;
    const matches = searchRecords(records, query, {
      category,
      collection,
      sort,
    });

    recentSearches = query ? updateRecentSearches(query, recentSearches) : recentSearches;
    renderResults(surface, matches, query, recentSearches);

    const collectionLabel =
      surface.collectionFilter.selectedOptions[0]?.textContent?.trim() === 'All types'
        ? ''
        : (surface.collectionFilter.selectedOptions[0]?.textContent?.trim() ?? '');

    surface.status.textContent = getResultSummary(query, matches.length, collectionLabel, category);

    if (isPageSurface) {
      updatePageSearchUrl(query, collection, category, sort);
    }
  };

  surface.form.addEventListener('submit', (event) => {
    event.preventDefault();
    runSearch();
    surface.input.focus();
  });

  surface.input.addEventListener('input', () => {
    runSearch();
  });

  surface.input.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusResultLink(surface, 1);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusResultLink(surface, -1);
      return;
    }

    if (event.key === 'Escape' && isPageSurface) {
      event.preventDefault();
      surface.input.value = '';
      runSearch();
    }
  });

  surface.collectionFilter.addEventListener('change', () => {
    populateCategoryOptions(surface, records);
    runSearch();
  });

  surface.categoryFilter.addEventListener('change', runSearch);
  surface.sortSelect.addEventListener('change', runSearch);

  surface.clearInput.addEventListener('click', () => {
    surface.input.value = '';
    runSearch();
    surface.input.focus();
  });

  surface.clearHistory.addEventListener('click', () => {
    recentSearches = [];
    saveRecentSearches([]);
    renderHistory(surface, []);
  });

  surface.history.addEventListener('click', (event) => {
    const target = event.target;

    if (!(target instanceof HTMLElement) || target.dataset.recentSearch === undefined) {
      return;
    }

    surface.input.value = target.dataset.recentSearch;
    runSearch();
    surface.input.focus();
  });

  if (!isPageSurface) {
    const dialog = getDialogSurface();
    const closeButton = dialog?.querySelector<HTMLButtonElement>('[data-search-close]');
    const backdrop = getDialogBackdrop();

    closeButton?.addEventListener('click', closeDialog);
    backdrop?.addEventListener('click', (event) => {
      if (event.target === backdrop) {
        closeDialog();
      }
    });

    dialog?.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeDialog();
        return;
      }

      trapDialogFocus(event, dialog);
    });
  }

  runSearch();
};

export const initSearch = async (): Promise<void> => {
  if (document.body.dataset.searchInitialized === 'true') {
    return;
  }

  document.body.dataset.searchInitialized = 'true';

  const surfaces = Array.from(document.querySelectorAll<HTMLElement>('[data-search-surface]'));

  if (!surfaces.length) {
    return;
  }

  const response = await fetch(SEARCH_INDEX_ENDPOINT);
  const payload = (await response.json()) as SearchRecord[];
  const records = normalizeSearchPayload(payload);

  document.addEventListener(SEARCH_OPEN_EVENT, openDialog);

  await Promise.all(
    surfaces.map((surface) => {
      const form = surface.querySelector<HTMLFormElement>('[data-search-form]');
      const input = surface.querySelector<HTMLInputElement>('[data-search-input]');
      const status = surface.querySelector<HTMLElement>('[data-search-status]');
      const results = surface.querySelector<HTMLElement>('[data-search-results]');
      const history = surface.querySelector<HTMLElement>('[data-search-history]');
      const clearInput = surface.querySelector<HTMLButtonElement>('[data-search-clear]');
      const clearHistory = surface.querySelector<HTMLButtonElement>('[data-search-history-clear]');
      const collectionFilter = surface.querySelector<HTMLSelectElement>(
        '[data-search-filter-collection]',
      );
      const categoryFilter = surface.querySelector<HTMLSelectElement>(
        '[data-search-filter-category]',
      );
      const sortSelect = surface.querySelector<HTMLSelectElement>('[data-search-sort]');

      if (
        !form ||
        !input ||
        !status ||
        !results ||
        !history ||
        !clearInput ||
        !clearHistory ||
        !collectionFilter ||
        !categoryFilter ||
        !sortSelect
      ) {
        return Promise.resolve();
      }

      return wireSurface(
        {
          root: surface,
          form,
          input,
          status,
          results,
          history,
          clearInput,
          clearHistory,
          collectionFilter,
          categoryFilter,
          sortSelect,
        },
        records,
      );
    }),
  );
};
