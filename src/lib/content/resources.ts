import type { CollectionEntry } from 'astro:content';

import { resourceConfig } from '@config/resources';

import { getPublishedCollectionEntries, sortByUpdatedDate } from './queries';
import {
  createTermSet,
  getEntryUrl,
  getReferenceKey,
  matchesTerms,
  resolveRelatedEntries,
  type RoutableEntry,
} from './relationships';

export type ResourceEntry = CollectionEntry<'resources'>;
export type ResourceRelatedArticleEntry = CollectionEntry<'articles'>;
export type ResourceRelatedLearningPathEntry = CollectionEntry<'learning-paths'>;
export type ResourceRelatedProjectEntry = CollectionEntry<'projects'>;
export type ResourceRelatedTechnologyEntry = CollectionEntry<'technologies'>;

export interface ResourceGroup {
  readonly category: string;
  readonly entries: readonly ResourceEntry[];
}

export interface ResourceStaticPathProps {
  readonly entry: ResourceEntry;
  readonly nextEntry?: ResourceEntry;
  readonly previousEntry?: ResourceEntry;
  readonly relatedArticleEntries: readonly ResourceRelatedArticleEntry[];
  readonly relatedLearningPathEntries: readonly ResourceRelatedLearningPathEntry[];
  readonly relatedProjectEntries: readonly ResourceRelatedProjectEntry[];
  readonly relatedTechnologyEntries: readonly ResourceRelatedTechnologyEntry[];
}

const titleCollator = new Intl.Collator(resourceConfig.locale, {
  sensitivity: 'base',
});

export const getResourceUrl = (slug: string): string => `${resourceConfig.routeBase}${slug}/`;

export const getResourceBreadcrumbs = (title?: string) => [
  { href: '/', label: resourceConfig.labels.home },
  title
    ? { href: resourceConfig.routeBase, label: resourceConfig.labels.resources }
    : { current: true, label: resourceConfig.labels.resources },
  ...(title ? [{ current: true, label: title }] : []),
];

export const formatResourceDate = (date: Date): string =>
  new Intl.DateTimeFormat(resourceConfig.locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);

export const formatResourceMachineDate = (date: Date): string => date.toISOString().slice(0, 10);

export const formatResourceType = (resourceType: ResourceEntry['data']['resourceType']): string =>
  resourceType
    .split('-')
    .map((segment) => `${segment.charAt(0).toLocaleUpperCase()}${segment.slice(1)}`)
    .join(' ');

export const sortResourceEntriesByTitle = <Entry extends ResourceEntry>(
  entries: readonly Entry[],
): Entry[] =>
  [...entries].sort((firstEntry, secondEntry) =>
    titleCollator.compare(firstEntry.data.title, secondEntry.data.title),
  );

export const getPublishedResourceEntries = async (): Promise<ResourceEntry[]> => {
  const entries = await getPublishedCollectionEntries('resources');

  return sortResourceEntriesByTitle(entries);
};

export const groupResourceEntriesByCategory = (
  entries: readonly ResourceEntry[],
): ResourceGroup[] => {
  const groups = new Map<string, ResourceEntry[]>();

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
      entries: sortResourceEntriesByTitle(groupEntries),
    }));
};

const getResourceTerms = (entry: ResourceEntry): ReadonlySet<string> =>
  createTermSet([
    entry.data.title,
    entry.data.resourceType,
    ...entry.data.technologies,
    ...entry.data.tags,
    ...entry.data.categories,
  ]);

const getTechnologyTerms = (entry: ResourceRelatedTechnologyEntry): readonly string[] => [
  entry.data.title,
  ...entry.data.technologies,
  ...entry.data.aliases,
  ...entry.data.tags,
];

const getRelatedTechnologyEntries = (
  entry: ResourceEntry,
  technologyEntries: readonly ResourceRelatedTechnologyEntry[],
): ResourceRelatedTechnologyEntry[] => {
  const terms = getResourceTerms(entry);

  return technologyEntries
    .filter((technologyEntry) => matchesTerms(getTechnologyTerms(technologyEntry), terms))
    .sort((firstEntry, secondEntry) =>
      titleCollator.compare(firstEntry.data.title, secondEntry.data.title),
    );
};

const getExplicitArticleEntries = (
  entry: ResourceEntry,
  lookup: ReadonlyMap<string, ResourceRelatedArticleEntry>,
): ResourceRelatedArticleEntry[] =>
  resolveRelatedEntries(
    {
      collection: entry.collection,
      slug: entry.data.slug,
    },
    entry.data.relatedAssets,
    lookup,
    {
      filter: (reference) => reference.collection === 'articles',
    },
  );

const getRelatedArticleEntries = (
  entry: ResourceEntry,
  articleEntries: readonly ResourceRelatedArticleEntry[],
): ResourceRelatedArticleEntry[] => {
  const terms = getResourceTerms(entry);
  const lookup = new Map(
    articleEntries.map((articleEntry) => [
      getReferenceKey(articleEntry.collection, articleEntry.data.slug),
      articleEntry,
    ]),
  );
  const combinedEntries = new Map<string, ResourceRelatedArticleEntry>();

  [
    ...getExplicitArticleEntries(entry, lookup),
    ...articleEntries.filter((articleEntry) => matchesTerms(articleEntry.data.technologies, terms)),
  ].forEach((articleEntry) => {
    combinedEntries.set(
      getReferenceKey(articleEntry.collection, articleEntry.data.slug),
      articleEntry,
    );
  });

  return sortByUpdatedDate([...combinedEntries.values()]);
};

const getExplicitProjectEntries = (
  entry: ResourceEntry,
  lookup: ReadonlyMap<string, ResourceRelatedProjectEntry>,
): ResourceRelatedProjectEntry[] =>
  resolveRelatedEntries(
    {
      collection: entry.collection,
      slug: entry.data.slug,
    },
    entry.data.relatedAssets,
    lookup,
    {
      filter: (reference) => reference.collection === 'projects',
    },
  );

const getRelatedProjectEntries = (
  entry: ResourceEntry,
  projectEntries: readonly ResourceRelatedProjectEntry[],
): ResourceRelatedProjectEntry[] => {
  const terms = getResourceTerms(entry);
  const lookup = new Map(
    projectEntries.map((projectEntry) => [
      getReferenceKey(projectEntry.collection, projectEntry.data.slug),
      projectEntry,
    ]),
  );
  const combinedEntries = new Map<string, ResourceRelatedProjectEntry>();

  [
    ...getExplicitProjectEntries(entry, lookup),
    ...projectEntries.filter((projectEntry) => matchesTerms(projectEntry.data.technologies, terms)),
  ].forEach((projectEntry) => {
    combinedEntries.set(
      getReferenceKey(projectEntry.collection, projectEntry.data.slug),
      projectEntry,
    );
  });

  return sortByUpdatedDate([...combinedEntries.values()]);
};

const getRelatedLearningPathEntries = (
  entry: ResourceEntry,
  learningPathEntries: readonly ResourceRelatedLearningPathEntry[],
): ResourceRelatedLearningPathEntry[] => {
  const terms = getResourceTerms(entry);

  return sortByUpdatedDate(
    learningPathEntries.filter((learningPathEntry) =>
      matchesTerms(learningPathEntry.data.technologies, terms),
    ),
  );
};

export const getResourceEntryUrl = (entry: RoutableEntry): string => getEntryUrl(entry);

export const getResourceStaticPaths = async () => {
  const entries = await getPublishedResourceEntries();
  const [articleEntries, learningPathEntries, projectEntries, technologyEntries] =
    await Promise.all([
      getPublishedCollectionEntries('articles'),
      getPublishedCollectionEntries('learning-paths'),
      getPublishedCollectionEntries('projects'),
      getPublishedCollectionEntries('technologies'),
    ]);

  return entries.map((entry, index) => ({
    params: {
      slug: entry.data.slug,
    },
    props: {
      entry,
      nextEntry: entries[index + 1],
      previousEntry: entries[index - 1],
      relatedArticleEntries: getRelatedArticleEntries(entry, articleEntries),
      relatedLearningPathEntries: getRelatedLearningPathEntries(entry, learningPathEntries),
      relatedProjectEntries: getRelatedProjectEntries(entry, projectEntries),
      relatedTechnologyEntries: getRelatedTechnologyEntries(entry, technologyEntries),
    } satisfies ResourceStaticPathProps,
  }));
};
