import type { CollectionEntry } from 'astro:content';

export type RelatedKnowledgeCollection = 'articles' | 'lab-notes' | 'architecture-guides';

export type RelatedKnowledgeEntry = {
  [CollectionName in RelatedKnowledgeCollection]: CollectionEntry<CollectionName>;
}[RelatedKnowledgeCollection];

export type RoutableCollection =
  RelatedKnowledgeCollection | 'projects' | 'technologies' | 'certifications' | 'resources';

export type RoutableEntry = {
  [CollectionName in RoutableCollection]: CollectionEntry<CollectionName>;
}[RoutableCollection];

export const relatedKnowledgeCollections = [
  'articles',
  'lab-notes',
  'architecture-guides',
] as const;

const routeBases = {
  articles: '/articles/',
  'lab-notes': '/lab-notes/',
  'architecture-guides': '/architecture/',
  projects: '/projects/',
  technologies: '/technologies/',
  certifications: '/certifications/',
  resources: '/resources/',
} satisfies Record<RoutableCollection, string>;

export const isRelatedKnowledgeCollection = (value: string): value is RelatedKnowledgeCollection =>
  relatedKnowledgeCollections.includes(value as RelatedKnowledgeCollection);

export const isRoutableCollection = (value: string): value is RoutableCollection =>
  Object.prototype.hasOwnProperty.call(routeBases, value);

export const getEntryUrl = (entry: RoutableEntry): string =>
  entry.data.seo.canonicalPath ?? `${routeBases[entry.collection]}${entry.data.slug}/`;

export const formatAssetType = (assetType: string): string =>
  assetType
    .split('-')
    .map((segment) => `${segment.charAt(0).toLocaleUpperCase()}${segment.slice(1)}`)
    .join(' ');

export const normalizeTerm = (term: string): string => term.trim().toLocaleLowerCase();

export const matchesTerms = (values: readonly string[], terms: ReadonlySet<string>): boolean =>
  values.some((value) => terms.has(normalizeTerm(value)));

export const getReferenceKey = (collection: string, slug: string): string =>
  `${collection}:${slug}`;

export const createTermSet = (values: readonly string[]): ReadonlySet<string> =>
  new Set(values.map(normalizeTerm));
