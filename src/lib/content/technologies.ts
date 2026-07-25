import type { CollectionEntry } from 'astro:content';

import { technologyConfig } from '@config/technologies';

import {
  getPublishedCollectionEntries,
  sortByUpdatedDate,
  type KnowledgeAssetEntry,
} from './queries';
import { resolveRelatedEntries } from './relationships';

export type TechnologyEntry = CollectionEntry<'technologies'>;

export type TechnologyRelatedKnowledgeCollection =
  'articles' | 'lab-notes' | 'architecture-guides' | 'case-studies';

export type TechnologyRelatedKnowledgeEntry = {
  [CollectionName in TechnologyRelatedKnowledgeCollection]: CollectionEntry<CollectionName>;
}[TechnologyRelatedKnowledgeCollection];

export type TechnologyRelatedProjectEntry = CollectionEntry<'projects'>;
export type TechnologyRelatedCertificationEntry = CollectionEntry<'certifications'>;

export interface TechnologyGroup {
  readonly category: string;
  readonly entries: readonly TechnologyEntry[];
}

export interface TechnologyStaticPathProps {
  readonly entry: TechnologyEntry;
  readonly nextEntry?: TechnologyEntry;
  readonly previousEntry?: TechnologyEntry;
  readonly relatedCertificationEntries: readonly TechnologyRelatedCertificationEntry[];
  readonly relatedKnowledgeEntries: readonly TechnologyRelatedKnowledgeEntry[];
  readonly relatedProjectEntries: readonly TechnologyRelatedProjectEntry[];
}

export const technologyRelatedKnowledgeCollections = [
  'articles',
  'lab-notes',
  'architecture-guides',
  'case-studies',
] as const;

const relatedKnowledgeRoutes = {
  articles: '/articles/',
  'lab-notes': '/lab-notes/',
  'architecture-guides': '/architecture/',
  'case-studies': '/case-studies/',
} satisfies Record<TechnologyRelatedKnowledgeCollection, string>;

const titleCollator = new Intl.Collator(technologyConfig.locale, {
  sensitivity: 'base',
});

export const isTechnologyRelatedKnowledgeCollection = (
  value: string,
): value is TechnologyRelatedKnowledgeCollection =>
  technologyRelatedKnowledgeCollections.includes(value as TechnologyRelatedKnowledgeCollection);

export const getTechnologyUrl = (slug: string): string => `${technologyConfig.routeBase}${slug}/`;

export const getTechnologyBreadcrumbs = (title?: string) => [
  { href: '/', label: technologyConfig.labels.home },
  title
    ? { href: technologyConfig.routeBase, label: technologyConfig.labels.technologies }
    : { current: true, label: technologyConfig.labels.technologies },
  ...(title ? [{ current: true, label: title }] : []),
];

export const formatTechnologyDate = (date: Date): string =>
  new Intl.DateTimeFormat(technologyConfig.locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);

export const formatTechnologyMachineDate = (date: Date): string => date.toISOString().slice(0, 10);

export const sortTechnologyEntriesByTitle = <Entry extends TechnologyEntry>(
  entries: readonly Entry[],
): Entry[] =>
  [...entries].sort((firstEntry, secondEntry) =>
    titleCollator.compare(firstEntry.data.title, secondEntry.data.title),
  );

export const getPublishedTechnologyEntries = async (): Promise<TechnologyEntry[]> => {
  const entries = await getPublishedCollectionEntries('technologies');

  return sortTechnologyEntriesByTitle(entries);
};

export const groupTechnologyEntriesByCategory = (
  entries: readonly TechnologyEntry[],
): TechnologyGroup[] => {
  const groups = new Map<string, TechnologyEntry[]>();

  entries.forEach((entry) => {
    entry.data.categories.forEach((category) => {
      const group = groups.get(category) ?? [];

      group.push(entry);
      groups.set(category, group);
    });
  });

  return [...groups.entries()]
    .sort(([firstCategory], [secondCategory]) =>
      titleCollator.compare(firstCategory, secondCategory),
    )
    .map(([category, groupEntries]) => ({
      category,
      entries: sortTechnologyEntriesByTitle(groupEntries),
    }));
};

export const getRelatedKnowledgeUrl = (entry: TechnologyRelatedKnowledgeEntry): string =>
  entry.data.seo.canonicalPath ?? `${relatedKnowledgeRoutes[entry.collection]}${entry.data.slug}/`;

export const getRelatedProjectUrl = (entry: TechnologyRelatedProjectEntry): string =>
  entry.data.seo.canonicalPath ?? `/projects/${entry.data.slug}/`;

const normalizeTechnologyTerm = (term: string): string => term.trim().toLocaleLowerCase();

const getTechnologyTerms = (entry: TechnologyEntry): ReadonlySet<string> =>
  new Set(
    [entry.data.title, ...entry.data.technologies, ...entry.data.aliases].map(
      normalizeTechnologyTerm,
    ),
  );

const matchesTerms = (values: readonly string[], terms: ReadonlySet<string>): boolean =>
  values.some((value) => terms.has(normalizeTechnologyTerm(value)));

const getRelatedKnowledgeKey = (entry: TechnologyRelatedKnowledgeEntry): string =>
  `${entry.collection}:${entry.data.slug}`;

const getExplicitRelatedKnowledgeEntries = (
  entry: TechnologyEntry,
  lookup: ReadonlyMap<string, TechnologyRelatedKnowledgeEntry>,
): TechnologyRelatedKnowledgeEntry[] =>
  resolveRelatedEntries(
    {
      collection: entry.collection,
      slug: entry.data.slug,
    },
    entry.data.relatedAssets,
    lookup,
    {
      filter: (reference) => isTechnologyRelatedKnowledgeCollection(reference.collection),
    },
  );

const getRelatedKnowledgeEntries = (
  entry: TechnologyEntry,
  relatedKnowledgeEntries: readonly TechnologyRelatedKnowledgeEntry[],
): TechnologyRelatedKnowledgeEntry[] => {
  const terms = getTechnologyTerms(entry);
  const lookup = new Map(
    relatedKnowledgeEntries.map((relatedEntry) => [
      getRelatedKnowledgeKey(relatedEntry),
      relatedEntry,
    ]),
  );
  const explicitEntries = getExplicitRelatedKnowledgeEntries(entry, lookup);
  const inferredEntries = relatedKnowledgeEntries.filter((relatedEntry) =>
    matchesTerms(relatedEntry.data.technologies, terms),
  );
  const combinedEntries = new Map<string, TechnologyRelatedKnowledgeEntry>();

  [...explicitEntries, ...inferredEntries].forEach((relatedEntry) => {
    combinedEntries.set(getRelatedKnowledgeKey(relatedEntry), relatedEntry);
  });

  return sortByUpdatedDate([...combinedEntries.values()]);
};

const getRelatedProjectEntries = (
  entry: TechnologyEntry,
  projectEntries: readonly TechnologyRelatedProjectEntry[],
): TechnologyRelatedProjectEntry[] => {
  const terms = getTechnologyTerms(entry);

  return sortByUpdatedDate(
    projectEntries.filter((projectEntry) => matchesTerms(projectEntry.data.technologies, terms)),
  );
};

const getRelatedCertificationEntries = (
  entry: TechnologyEntry,
  certificationEntries: readonly TechnologyRelatedCertificationEntry[],
): TechnologyRelatedCertificationEntry[] => {
  const terms = getTechnologyTerms(entry);

  return sortByUpdatedDate(
    certificationEntries.filter(
      (certificationEntry) =>
        matchesTerms(certificationEntry.data.technologies, terms) ||
        matchesTerms(certificationEntry.data.skills, terms),
    ),
  );
};

const getPublishedRelatedKnowledgeEntries = async (): Promise<
  TechnologyRelatedKnowledgeEntry[]
> => {
  const entriesByCollection = await Promise.all(
    technologyRelatedKnowledgeCollections.map(async (collection) =>
      getPublishedCollectionEntries(collection),
    ),
  );

  return entriesByCollection.flat();
};

export const getTechnologyStaticPaths = async () => {
  const entries = await getPublishedTechnologyEntries();
  const [relatedKnowledgeEntries, relatedProjectEntries, relatedCertificationEntries] =
    await Promise.all([
      getPublishedRelatedKnowledgeEntries(),
      getPublishedCollectionEntries('projects'),
      getPublishedCollectionEntries('certifications'),
    ]);

  return entries.map((entry, index) => ({
    params: {
      slug: entry.data.slug,
    },
    props: {
      entry,
      nextEntry: entries[index + 1],
      previousEntry: entries[index - 1],
      relatedCertificationEntries: getRelatedCertificationEntries(
        entry,
        relatedCertificationEntries,
      ),
      relatedKnowledgeEntries: getRelatedKnowledgeEntries(entry, relatedKnowledgeEntries),
      relatedProjectEntries: getRelatedProjectEntries(entry, relatedProjectEntries),
    } satisfies TechnologyStaticPathProps,
  }));
};

export const isTechnologyEntry = (entry: KnowledgeAssetEntry): entry is TechnologyEntry =>
  entry.collection === 'technologies';
