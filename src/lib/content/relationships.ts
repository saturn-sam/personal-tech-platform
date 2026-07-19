import type { CollectionEntry } from 'astro:content';

export interface AssetReferenceLike {
  collection: string;
  slug: string;
}

export interface ReferenceOwner {
  collection: string;
  slug: string;
}

export type RelatedKnowledgeCollection = 'articles' | 'lab-notes' | 'architecture-guides';

export type RelatedKnowledgeEntry = {
  [CollectionName in RelatedKnowledgeCollection]: CollectionEntry<CollectionName>;
}[RelatedKnowledgeCollection];

export type RoutableCollection =
  | RelatedKnowledgeCollection
  | 'projects'
  | 'technologies'
  | 'certifications'
  | 'resources'
  | 'learning-paths';

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
  'learning-paths': '/learning-paths/',
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

const warnedMissingReferences = new Set<string>();

const warnMissingReference = (owner: ReferenceOwner, reference: AssetReferenceLike): void => {
  const warningKey = `${getReferenceKey(owner.collection, owner.slug)}->${getReferenceKey(
    reference.collection,
    reference.slug,
  )}`;

  if (warnedMissingReferences.has(warningKey)) {
    return;
  }

  warnedMissingReferences.add(warningKey);
  console.warn(
    `[content] Missing related asset reference "${reference.collection}/${reference.slug}" in "${owner.collection}/${owner.slug}". The reference will be omitted.`,
  );
};

export const resolveRelatedEntries = <
  ResolvedEntry,
  Reference extends AssetReferenceLike = AssetReferenceLike,
>(
  owner: ReferenceOwner,
  references: readonly Reference[],
  lookup: ReadonlyMap<string, ResolvedEntry>,
  options: {
    filter?: (reference: Reference) => boolean;
    getLookupKey?: (reference: Reference) => string;
  } = {},
): ResolvedEntry[] => {
  const resolvedEntries: ResolvedEntry[] = [];

  references.forEach((reference) => {
    if (options.filter && !options.filter(reference)) {
      return;
    }

    const lookupKey = options.getLookupKey
      ? options.getLookupKey(reference)
      : getReferenceKey(reference.collection, reference.slug);
    const relatedEntry = lookup.get(lookupKey);

    if (relatedEntry) {
      resolvedEntries.push(relatedEntry);
      return;
    }

    warnMissingReference(owner, reference);
  });

  return resolvedEntries;
};
