import type { CollectionEntry } from 'astro:content';

import { projectConfig } from '@config/projects';

import {
  getPublishedCollectionEntries,
  sortByUpdatedDate,
  type KnowledgeAssetEntry,
} from './queries';
import { resolveRelatedEntries } from './relationships';

export type ProjectEntry = CollectionEntry<'projects'>;

export type ProjectRelatedKnowledgeCollection = 'articles' | 'lab-notes' | 'architecture-guides';

export type ProjectRelatedKnowledgeEntry = {
  [CollectionName in ProjectRelatedKnowledgeCollection]: CollectionEntry<CollectionName>;
}[ProjectRelatedKnowledgeCollection];

export interface ProjectStaticPathProps {
  readonly entry: ProjectEntry;
  readonly nextEntry?: ProjectEntry;
  readonly previousEntry?: ProjectEntry;
  readonly relatedKnowledgeEntries: readonly ProjectRelatedKnowledgeEntry[];
}

export interface ProjectTimelineItem {
  readonly date: Date;
  readonly description: string;
  readonly title: string;
}

export interface ProjectGalleryImage {
  readonly alt: string;
  readonly src: string;
}

export const projectRelatedKnowledgeCollections = [
  'articles',
  'lab-notes',
  'architecture-guides',
] as const;

const relatedKnowledgeRoutes = {
  articles: '/articles/',
  'lab-notes': '/lab-notes/',
  'architecture-guides': '/architecture/',
} satisfies Record<ProjectRelatedKnowledgeCollection, string>;

export const isProjectRelatedKnowledgeCollection = (
  value: string,
): value is ProjectRelatedKnowledgeCollection =>
  projectRelatedKnowledgeCollections.includes(value as ProjectRelatedKnowledgeCollection);

export const getProjectUrl = (slug: string): string => `${projectConfig.routeBase}${slug}/`;

export const getRelatedKnowledgeUrl = (entry: ProjectRelatedKnowledgeEntry): string =>
  entry.data.seo.canonicalPath ?? `${relatedKnowledgeRoutes[entry.collection]}${entry.data.slug}/`;

export const getProjectBreadcrumbs = (title?: string) => [
  { href: '/', label: projectConfig.labels.home },
  title
    ? { href: projectConfig.routeBase, label: projectConfig.labels.projects }
    : { current: true, label: projectConfig.labels.projects },
  ...(title ? [{ current: true, label: title }] : []),
];

export const formatProjectDate = (date: Date): string =>
  new Intl.DateTimeFormat(projectConfig.locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);

export const formatProjectMachineDate = (date: Date): string => date.toISOString().slice(0, 10);

export const formatProjectWindow = (entry: ProjectEntry): string => {
  const start = formatProjectDate(entry.data.startDate);

  if (!entry.data.endDate) {
    return `${start} - present`;
  }

  return `${start} - ${formatProjectDate(entry.data.endDate)}`;
};

export const getPublishedProjectEntries = async (): Promise<ProjectEntry[]> => {
  const entries = await getPublishedCollectionEntries('projects');

  return sortByUpdatedDate(entries);
};

export const getProjectGallery = (entry: ProjectEntry): ProjectGalleryImage[] => {
  const gallery = entry.data.gallery.length > 0 ? entry.data.gallery : [entry.data.featuredImage];

  return gallery.map((image) => ({
    alt: image.alt,
    src: image.src,
  }));
};

export const getProjectTimeline = (entry: ProjectEntry): ProjectTimelineItem[] => {
  if (entry.data.timeline.length > 0) {
    return [...entry.data.timeline].sort(
      (firstItem, secondItem) => firstItem.date.getTime() - secondItem.date.getTime(),
    );
  }

  const fallbackTimeline: ProjectTimelineItem[] = [
    {
      date: entry.data.startDate,
      description: `Project implementation started in the ${entry.data.environment}.`,
      title: 'Project started',
    },
  ];

  if (entry.data.endDate) {
    fallbackTimeline.push({
      date: entry.data.endDate,
      description: 'Project implementation reached its documented completion state.',
      title: 'Project completed',
    });
  }

  return fallbackTimeline;
};

const getRelatedKnowledgeLookup = async (): Promise<Map<string, ProjectRelatedKnowledgeEntry>> => {
  const entriesByCollection = await Promise.all(
    projectRelatedKnowledgeCollections.map(async (collection) => {
      const entries = await getPublishedCollectionEntries(collection);

      return entries.map((entry) => [`${collection}:${entry.data.slug}`, entry] as const);
    }),
  );

  return new Map(entriesByCollection.flat());
};

const getRelatedKnowledgeEntries = (
  entry: ProjectEntry,
  lookup: ReadonlyMap<string, ProjectRelatedKnowledgeEntry>,
): ProjectRelatedKnowledgeEntry[] =>
  resolveRelatedEntries(
    {
      collection: entry.collection,
      slug: entry.data.slug,
    },
    entry.data.relatedAssets,
    lookup,
    {
      filter: (reference) => isProjectRelatedKnowledgeCollection(reference.collection),
    },
  );

export const getProjectStaticPaths = async () => {
  const entries = await getPublishedProjectEntries();
  const relatedKnowledgeLookup = await getRelatedKnowledgeLookup();

  return entries.map((entry, index) => ({
    params: {
      slug: entry.data.slug,
    },
    props: {
      entry,
      nextEntry: entries[index + 1],
      previousEntry: entries[index - 1],
      relatedKnowledgeEntries: getRelatedKnowledgeEntries(entry, relatedKnowledgeLookup),
    } satisfies ProjectStaticPathProps,
  }));
};

export const isProjectEntry = (entry: KnowledgeAssetEntry): entry is ProjectEntry =>
  entry.collection === 'projects';
