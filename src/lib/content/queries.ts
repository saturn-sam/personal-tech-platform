import { getCollection, type CollectionEntry } from 'astro:content';

import { contentCollectionNames, type ContentCollectionName } from './collections';

export type KnowledgeAssetEntry = {
  [CollectionName in ContentCollectionName]: CollectionEntry<CollectionName>;
}[ContentCollectionName];

export const isPublishedEntry = (entry: KnowledgeAssetEntry): boolean =>
  entry.data.status === 'published';

export const sortByUpdatedDate = <Entry extends KnowledgeAssetEntry>(
  entries: readonly Entry[],
): Entry[] =>
  [...entries].sort(
    (firstEntry, secondEntry) =>
      secondEntry.data.updatedDate.getTime() - firstEntry.data.updatedDate.getTime(),
  );

export const getCollectionEntries = async <CollectionName extends ContentCollectionName>(
  collection: CollectionName,
): Promise<CollectionEntry<CollectionName>[]> => getCollection(collection);

export const getPublishedCollectionEntries = async <CollectionName extends ContentCollectionName>(
  collection: CollectionName,
): Promise<CollectionEntry<CollectionName>[]> => {
  const entries = await getCollectionEntries(collection);

  return entries.filter((entry) => entry.data.status === 'published');
};

export const getContentEntryBySlug = async <CollectionName extends ContentCollectionName>(
  collection: CollectionName,
  slug: string,
): Promise<CollectionEntry<CollectionName> | undefined> => {
  const entries = await getCollectionEntries(collection);

  return entries.find((entry) => entry.data.slug === slug);
};

export const getAllKnowledgeAssets = async (): Promise<KnowledgeAssetEntry[]> => {
  const entriesByCollection = await Promise.all(
    contentCollectionNames.map(async (collection) => getCollection(collection)),
  );

  return sortByUpdatedDate(entriesByCollection.flat() as KnowledgeAssetEntry[]);
};

export const getPublishedKnowledgeAssets = async (): Promise<KnowledgeAssetEntry[]> => {
  const entries = await getAllKnowledgeAssets();

  return entries.filter(isPublishedEntry);
};
