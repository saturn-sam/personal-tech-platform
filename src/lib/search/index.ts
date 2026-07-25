import { contentCollections } from '@lib/content/collections';
import {
  getEntryUrl,
  getReferenceKey,
  isRoutableCollection,
  resolveRelatedEntries,
} from '@lib/content/relationships';

export interface SearchRelatedLink {
  href: string;
  title: string;
  typeLabel: string;
}

export interface SearchRecord {
  id: string;
  title: string;
  summary: string;
  description: string;
  slug: string;
  collection: string;
  collectionLabel: string;
  href: string;
  assetType: string;
  typeLabel: string;
  breadcrumb: string[];
  tags: string[];
  technologies: string[];
  categories: string[];
  body: string;
  headings: string[];
  readingTimeText?: string;
  relatedLinks: SearchRelatedLink[];
  updatedAt: string;
  featured: boolean;
}

interface SearchAssetReference {
  collection: string;
  slug: string;
}

export interface SearchEntryLike {
  collection: string;
  body?: string;
  data: {
    slug: string;
    title: string;
    summary: string;
    description: string;
    tags: string[];
    technologies: string[];
    categories: string[];
    assetType?: string;
    featured?: boolean;
    readingTime?: { text?: string };
    relatedAssets?: SearchAssetReference[];
    seo?: { canonicalPath?: string };
    updatedDate?: Date;
  };
}

export interface SearchOptions {
  category?: string;
  collection?: string;
  limit?: number;
  sort?: SearchSort;
}

export type SearchSort = 'recent' | 'relevance' | 'title';

const contentTypeLabels: Record<string, string> = {
  article: 'Article',
  'lab-note': 'Lab Note',
  'architecture-guide': 'Architecture Guide',
  'case-study': 'Case Study',
  project: 'Project',
  technology: 'Technology',
  certification: 'Certification',
  resource: 'Resource',
  'learning-path': 'Learning Path',
};

const normalizeText = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s/-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const tokenize = (query: string): string[] => normalizeText(query).split(' ').filter(Boolean);

const formatTypeLabel = (assetType: string): string =>
  contentTypeLabels[assetType] ?? assetType.replace(/-/g, ' ');

const formatCollectionLabel = (collection: string): string =>
  contentCollections[collection as keyof typeof contentCollections]?.label ??
  collection.replace(/-/g, ' ');

const extractHeadings = (body: string): string[] => {
  const matches = body.match(/^(#{1,6})\s+(.+)$/gm) ?? [];

  return matches
    .map((heading) => heading.replace(/^#{1,6}\s+/, '').trim())
    .filter(Boolean)
    .slice(0, 10);
};

const isSubsequenceMatch = (query: string, candidate: string): boolean => {
  let queryIndex = 0;

  for (const character of candidate) {
    if (character === query[queryIndex]) {
      queryIndex += 1;
    }

    if (queryIndex === query.length) {
      return true;
    }
  }

  return false;
};

const getEditDistanceWithin = (
  source: string,
  target: string,
  maxDistance: number,
): number | null => {
  if (Math.abs(source.length - target.length) > maxDistance) {
    return null;
  }

  const previousRow = Array.from({ length: target.length + 1 }, (_, index) => index);

  for (let sourceIndex = 1; sourceIndex <= source.length; sourceIndex += 1) {
    let minInRow = sourceIndex;
    let diagonal = sourceIndex - 1;
    previousRow[0] = sourceIndex;

    for (let targetIndex = 1; targetIndex <= target.length; targetIndex += 1) {
      const stored = previousRow[targetIndex];
      const cost = source[sourceIndex - 1] === target[targetIndex - 1] ? 0 : 1;
      const value = Math.min(
        previousRow[targetIndex] + 1,
        previousRow[targetIndex - 1] + 1,
        diagonal + cost,
      );

      diagonal = stored;
      previousRow[targetIndex] = value;
      minInRow = Math.min(minInRow, value);
    }

    if (minInRow > maxDistance) {
      return null;
    }
  }

  return previousRow[target.length] <= maxDistance ? previousRow[target.length] : null;
};

const getTokenScore = (token: string, term: string): number => {
  if (token === term) {
    return 40;
  }

  if (token.startsWith(term)) {
    return 28;
  }

  if (token.includes(term)) {
    return 16;
  }

  if (term.length >= 4 && getEditDistanceWithin(token, term, 2) !== null) {
    return 10;
  }

  if (term.length >= 4 && isSubsequenceMatch(term, token)) {
    return 6;
  }

  return 0;
};

const getFieldScore = (value: string, term: string): number => {
  const normalizedValue = normalizeText(value);

  if (!normalizedValue) {
    return 0;
  }

  if (normalizedValue === term) {
    return 48;
  }

  if (normalizedValue.startsWith(term)) {
    return 32;
  }

  if (normalizedValue.includes(term)) {
    return 18;
  }

  return normalizedValue
    .split(' ')
    .filter(Boolean)
    .reduce((highestScore, token) => Math.max(highestScore, getTokenScore(token, term)), 0);
};

const getScore = (record: SearchRecord, terms: string[]): number => {
  const fields = {
    title: record.title,
    tags: record.tags.join(' '),
    summary: record.summary,
    description: record.description,
    headings: record.headings.join(' '),
    technologies: record.technologies.join(' '),
    categories: record.categories.join(' '),
    body: record.body,
  };

  return terms.reduce((score, term) => {
    return (
      score +
      getFieldScore(fields.title, term) * 4 +
      getFieldScore(fields.tags, term) * 2.5 +
      getFieldScore(fields.summary, term) * 2 +
      getFieldScore(fields.description, term) * 2 +
      getFieldScore(fields.headings, term) * 1.75 +
      getFieldScore(fields.technologies, term) * 1.5 +
      getFieldScore(fields.categories, term) * 1.25 +
      getFieldScore(fields.body, term) * 0.8
    );
  }, 0);
};

const matchesFilters = (record: SearchRecord, options: SearchOptions): boolean => {
  if (options.collection && record.collection !== options.collection) {
    return false;
  }

  if (options.category && !record.categories.includes(options.category)) {
    return false;
  }

  return true;
};

const sortByUpdatedDate = (first: SearchRecord, second: SearchRecord): number =>
  new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime();

const sortAlphabetically = (first: SearchRecord, second: SearchRecord): number =>
  first.title.localeCompare(second.title);

export const buildSearchRecords = (entries: readonly SearchEntryLike[]): SearchRecord[] => {
  const referenceMap = new Map<string, { href: string; title: string; typeLabel: string }>();

  entries.forEach((entry) => {
    const href =
      entry.data.seo?.canonicalPath ??
      (isRoutableCollection(entry.collection)
        ? getEntryUrl(entry as Parameters<typeof getEntryUrl>[0])
        : `/${entry.collection}/${entry.data.slug}/`);

    referenceMap.set(getReferenceKey(entry.collection, entry.data.slug), {
      href,
      title: entry.data.title,
      typeLabel: formatTypeLabel(entry.data.assetType ?? entry.collection),
    });
  });

  return entries.map((entry) => {
    const href =
      entry.data.seo?.canonicalPath ??
      (isRoutableCollection(entry.collection)
        ? getEntryUrl(entry as Parameters<typeof getEntryUrl>[0])
        : `/${entry.collection}/${entry.data.slug}/`);
    const body = entry.body ?? '';
    const collectionLabel = formatCollectionLabel(entry.collection);
    const categories = entry.data.categories ?? [];
    const breadcrumb = ['Home', collectionLabel, ...categories.slice(0, 1)];

    return {
      id: `${entry.collection}/${entry.data.slug}`,
      title: entry.data.title,
      summary: entry.data.summary,
      description: entry.data.description,
      slug: entry.data.slug,
      collection: entry.collection,
      collectionLabel,
      href,
      assetType: entry.data.assetType ?? entry.collection,
      typeLabel: formatTypeLabel(entry.data.assetType ?? entry.collection),
      breadcrumb,
      tags: entry.data.tags ?? [],
      technologies: entry.data.technologies ?? [],
      categories,
      body,
      headings: extractHeadings(body),
      readingTimeText: entry.data.readingTime?.text,
      relatedLinks: resolveRelatedEntries(
        {
          collection: entry.collection,
          slug: entry.data.slug,
        },
        entry.data.relatedAssets ?? [],
        referenceMap,
      ).slice(0, 3),
      updatedAt:
        entry.data.updatedDate instanceof Date
          ? entry.data.updatedDate.toISOString()
          : new Date(0).toISOString(),
      featured: entry.data.featured ?? false,
    };
  });
};

export const normalizeSearchPayload = (
  payload: readonly SearchEntryLike[] | readonly SearchRecord[],
): SearchRecord[] => {
  if (payload.length === 0) {
    return [];
  }

  const firstValue = payload[0];

  if (typeof firstValue === 'object' && firstValue !== null && 'data' in firstValue) {
    return buildSearchRecords(payload as readonly SearchEntryLike[]);
  }

  return (payload as readonly SearchRecord[]).map((record) => ({
    ...record,
    breadcrumb: [...record.breadcrumb],
    categories: [...record.categories],
    headings: [...record.headings],
    relatedLinks: record.relatedLinks.map((link) => ({ ...link })),
    tags: [...record.tags],
    technologies: [...record.technologies],
  }));
};

export const getSearchCollectionOptions = (records: readonly SearchRecord[]) =>
  Array.from(
    records.reduce((map, record) => map.set(record.collection, record.collectionLabel), new Map()),
  )
    .sort((first, second) => String(first[1]).localeCompare(String(second[1])))
    .map(([value, label]) => ({ label, value }));

export const getSearchCategoryOptions = (records: readonly SearchRecord[]) =>
  Array.from(
    new Set(
      records
        .flatMap((record) => record.categories)
        .filter(Boolean)
        .sort((first, second) => first.localeCompare(second)),
    ),
  );

export const searchRecords = (
  records: readonly SearchRecord[],
  query: string,
  options: SearchOptions = {},
): SearchRecord[] => {
  const terms = tokenize(query);
  const limit = options.limit ?? 24;
  const sort = options.sort ?? 'relevance';
  const filteredRecords = records.filter((record) => matchesFilters(record, options));

  if (!terms.length) {
    const defaultResults = [...filteredRecords].sort(sortByUpdatedDate);

    if (sort === 'title') {
      defaultResults.sort(sortAlphabetically);
    }

    const featuredResults = defaultResults.filter((record) => record.featured);

    return (featuredResults.length > 0 ? featuredResults : defaultResults)
      .slice(0, Math.min(limit, 12))
      .map((record) => ({ ...record }));
  }

  const matches = filteredRecords
    .map((record) => ({ record, score: getScore(record, terms) }))
    .filter(({ score }) => score > 0);

  matches.sort((first, second) => {
    if (sort === 'recent') {
      return sortByUpdatedDate(first.record, second.record);
    }

    if (sort === 'title') {
      return sortAlphabetically(first.record, second.record);
    }

    return second.score - first.score || sortByUpdatedDate(first.record, second.record);
  });

  return matches.slice(0, limit).map(({ record }) => ({ ...record }));
};
