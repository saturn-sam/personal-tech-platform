import type { MarkdownHeading } from 'astro';
import type { CollectionEntry } from 'astro:content';

import { knowledgeAssetConfig, type KnowledgeAssetCollectionName } from '@config/knowledge-assets';

import { getPublishedCollectionEntries, sortByUpdatedDate } from './queries';

export type { KnowledgeAssetCollectionName };

export type KnowledgeAssetEntry = {
  [CollectionName in KnowledgeAssetCollectionName]: CollectionEntry<CollectionName>;
}[KnowledgeAssetCollectionName];

export type KnowledgeAssetEntryForCollection<CollectionName extends KnowledgeAssetCollectionName> =
  CollectionEntry<CollectionName>;

export interface KnowledgeAssetStaticPathProps<
  CollectionName extends KnowledgeAssetCollectionName,
> {
  readonly entry: KnowledgeAssetEntryForCollection<CollectionName>;
  readonly nextEntry?: KnowledgeAssetEntryForCollection<CollectionName>;
  readonly previousEntry?: KnowledgeAssetEntryForCollection<CollectionName>;
}

export const knowledgeAssetCollectionNames = Object.keys(
  knowledgeAssetConfig.collections,
) as KnowledgeAssetCollectionName[];

export const getKnowledgeAssetCollectionConfig = (collection: KnowledgeAssetCollectionName) =>
  knowledgeAssetConfig.collections[collection];

export const getKnowledgeAssetUrl = (
  collection: KnowledgeAssetCollectionName,
  slug: string,
): string => {
  const { routeBase } = getKnowledgeAssetCollectionConfig(collection);

  return `${routeBase}${slug}/`;
};

export const getKnowledgeAssetIndexBreadcrumbs = (collection: KnowledgeAssetCollectionName) => [
  { href: '/', label: knowledgeAssetConfig.labels.home },
  {
    current: true,
    label: getKnowledgeAssetCollectionConfig(collection).indexTitle,
  },
];

export const getKnowledgeAssetBreadcrumbs = (
  collection: KnowledgeAssetCollectionName,
  title: string,
) => [
  { href: '/', label: knowledgeAssetConfig.labels.home },
  {
    href: getKnowledgeAssetCollectionConfig(collection).routeBase,
    label: getKnowledgeAssetCollectionConfig(collection).indexTitle,
  },
  {
    current: true,
    label: title,
  },
];

export const formatKnowledgeAssetDate = (date: Date): string =>
  new Intl.DateTimeFormat(knowledgeAssetConfig.locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);

export const formatKnowledgeAssetMachineDate = (date: Date): string =>
  date.toISOString().slice(0, 10);

export const calculateReadingTime = (content: string, wordsPerMinute = 225) => {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));

  return {
    minutes,
    text: `${minutes} min read`,
  };
};

export const getKnowledgeAssetReadingTime = (entry: KnowledgeAssetEntry) => {
  if (entry.data.readingTime) {
    return entry.data.readingTime;
  }

  const body = 'body' in entry && typeof entry.body === 'string' ? entry.body : '';

  return calculateReadingTime(body);
};

export const getKnowledgeAssetTocHeadings = (
  headings: readonly MarkdownHeading[],
): MarkdownHeading[] =>
  headings.filter((heading) => heading.depth >= 2 && heading.depth <= 3 && heading.slug);

export const getPublishedKnowledgeAssetEntries = async <
  CollectionName extends KnowledgeAssetCollectionName,
>(
  collection: CollectionName,
): Promise<KnowledgeAssetEntryForCollection<CollectionName>[]> => {
  const entries = await getPublishedCollectionEntries(collection);

  return sortByUpdatedDate(entries);
};

export const getKnowledgeAssetStaticPaths = async <
  CollectionName extends KnowledgeAssetCollectionName,
>(
  collection: CollectionName,
) => {
  const entries = await getPublishedKnowledgeAssetEntries(collection);

  return entries.map((entry, index) => ({
    params: {
      slug: entry.data.slug,
    },
    props: {
      entry,
      nextEntry: entries[index + 1],
      previousEntry: entries[index - 1],
    } satisfies KnowledgeAssetStaticPathProps<CollectionName>,
  }));
};
