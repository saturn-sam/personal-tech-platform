import type { CollectionEntry } from 'astro:content';

import { certificationConfig } from '@config/certifications';

import { getPublishedCollectionEntries, sortByUpdatedDate } from './queries';
import {
  createTermSet,
  getEntryUrl,
  getReferenceKey,
  isRelatedKnowledgeCollection,
  matchesTerms,
  relatedKnowledgeCollections,
  type RelatedKnowledgeEntry,
} from './relationships';

export type CertificationEntry = CollectionEntry<'certifications'>;
export type CertificationRelatedKnowledgeEntry = RelatedKnowledgeEntry;
export type CertificationRelatedLearningPathEntry = CollectionEntry<'learning-paths'>;
export type CertificationRelatedProjectEntry = CollectionEntry<'projects'>;
export type CertificationRelatedTechnologyEntry = CollectionEntry<'technologies'>;

export interface CertificationGroup {
  readonly entries: readonly CertificationEntry[];
  readonly issuer: string;
}

export interface CertificationStaticPathProps {
  readonly entry: CertificationEntry;
  readonly nextEntry?: CertificationEntry;
  readonly previousEntry?: CertificationEntry;
  readonly relatedKnowledgeEntries: readonly CertificationRelatedKnowledgeEntry[];
  readonly relatedLearningPathEntries: readonly CertificationRelatedLearningPathEntry[];
  readonly relatedProjectEntries: readonly CertificationRelatedProjectEntry[];
  readonly relatedTechnologyEntries: readonly CertificationRelatedTechnologyEntry[];
}

const titleCollator = new Intl.Collator(certificationConfig.locale, {
  sensitivity: 'base',
});

export const getCertificationUrl = (slug: string): string =>
  `${certificationConfig.routeBase}${slug}/`;

export const getCertificationBreadcrumbs = (title?: string) => [
  { href: '/', label: certificationConfig.labels.home },
  title
    ? { href: certificationConfig.routeBase, label: certificationConfig.labels.certifications }
    : { current: true, label: certificationConfig.labels.certifications },
  ...(title ? [{ current: true, label: title }] : []),
];

export const formatCertificationDate = (date: Date): string =>
  new Intl.DateTimeFormat(certificationConfig.locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);

export const formatCertificationMachineDate = (date: Date): string =>
  date.toISOString().slice(0, 10);

export const sortCertificationEntries = <Entry extends CertificationEntry>(
  entries: readonly Entry[],
): Entry[] =>
  [...entries].sort((firstEntry, secondEntry) => {
    const dateDifference =
      secondEntry.data.certificationDate.getTime() - firstEntry.data.certificationDate.getTime();

    if (dateDifference !== 0) {
      return dateDifference;
    }

    return titleCollator.compare(firstEntry.data.title, secondEntry.data.title);
  });

export const getPublishedCertificationEntries = async (): Promise<CertificationEntry[]> => {
  const entries = await getPublishedCollectionEntries('certifications');

  return sortCertificationEntries(entries);
};

export const groupCertificationEntriesByIssuer = (
  entries: readonly CertificationEntry[],
): CertificationGroup[] => {
  const groups = new Map<string, CertificationEntry[]>();

  entries.forEach((entry) => {
    const group = groups.get(entry.data.issuer) ?? [];

    group.push(entry);
    groups.set(entry.data.issuer, group);
  });

  return [...groups.entries()]
    .sort(([firstIssuer], [secondIssuer]) => titleCollator.compare(firstIssuer, secondIssuer))
    .map(([issuer, groupEntries]) => ({
      entries: sortCertificationEntries(groupEntries),
      issuer,
    }));
};

const getCertificationTerms = (entry: CertificationEntry): ReadonlySet<string> =>
  createTermSet([
    entry.data.title,
    entry.data.issuer,
    ...entry.data.technologies,
    ...entry.data.skills,
    ...entry.data.tags,
  ]);

const getTechnologyTerms = (entry: CertificationRelatedTechnologyEntry): readonly string[] => [
  entry.data.title,
  ...entry.data.technologies,
  ...entry.data.aliases,
  ...entry.data.tags,
];

const getRelatedTechnologyEntries = (
  entry: CertificationEntry,
  technologyEntries: readonly CertificationRelatedTechnologyEntry[],
): CertificationRelatedTechnologyEntry[] => {
  const terms = getCertificationTerms(entry);

  return technologyEntries
    .filter((technologyEntry) => matchesTerms(getTechnologyTerms(technologyEntry), terms))
    .sort((firstEntry, secondEntry) =>
      titleCollator.compare(firstEntry.data.title, secondEntry.data.title),
    );
};

const getRelatedProjectEntries = (
  entry: CertificationEntry,
  projectEntries: readonly CertificationRelatedProjectEntry[],
): CertificationRelatedProjectEntry[] => {
  const terms = getCertificationTerms(entry);

  return sortByUpdatedDate(
    projectEntries.filter((projectEntry) => matchesTerms(projectEntry.data.technologies, terms)),
  );
};

const getRelatedLearningPathEntries = (
  entry: CertificationEntry,
  learningPathEntries: readonly CertificationRelatedLearningPathEntry[],
): CertificationRelatedLearningPathEntry[] => {
  const terms = getCertificationTerms(entry);

  return sortByUpdatedDate(
    learningPathEntries.filter((learningPathEntry) =>
      matchesTerms(learningPathEntry.data.technologies, terms),
    ),
  );
};

const getExplicitRelatedKnowledgeEntries = (
  entry: CertificationEntry,
  lookup: ReadonlyMap<string, CertificationRelatedKnowledgeEntry>,
): CertificationRelatedKnowledgeEntry[] =>
  entry.data.relatedAssets
    .filter((reference) => isRelatedKnowledgeCollection(reference.collection))
    .map((reference) => lookup.get(getReferenceKey(reference.collection, reference.slug)))
    .filter((relatedEntry): relatedEntry is CertificationRelatedKnowledgeEntry =>
      Boolean(relatedEntry),
    );

const getRelatedKnowledgeEntries = (
  entry: CertificationEntry,
  relatedKnowledgeEntries: readonly CertificationRelatedKnowledgeEntry[],
): CertificationRelatedKnowledgeEntry[] => {
  const terms = getCertificationTerms(entry);
  const lookup = new Map(
    relatedKnowledgeEntries.map((relatedEntry) => [
      getReferenceKey(relatedEntry.collection, relatedEntry.data.slug),
      relatedEntry,
    ]),
  );
  const combinedEntries = new Map<string, CertificationRelatedKnowledgeEntry>();

  [
    ...getExplicitRelatedKnowledgeEntries(entry, lookup),
    ...relatedKnowledgeEntries.filter((relatedEntry) =>
      matchesTerms(relatedEntry.data.technologies, terms),
    ),
  ].forEach((relatedEntry) => {
    combinedEntries.set(
      getReferenceKey(relatedEntry.collection, relatedEntry.data.slug),
      relatedEntry,
    );
  });

  return sortByUpdatedDate([...combinedEntries.values()]);
};

const getPublishedRelatedKnowledgeEntries = async (): Promise<
  CertificationRelatedKnowledgeEntry[]
> => {
  const entriesByCollection = await Promise.all(
    relatedKnowledgeCollections.map(async (collection) =>
      getPublishedCollectionEntries(collection),
    ),
  );

  return entriesByCollection.flat();
};

export const getCertificationEntryUrl = getEntryUrl;

export const getCertificationStaticPaths = async () => {
  const entries = await getPublishedCertificationEntries();
  const [knowledgeEntries, learningPathEntries, projectEntries, technologyEntries] =
    await Promise.all([
      getPublishedRelatedKnowledgeEntries(),
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
      relatedKnowledgeEntries: getRelatedKnowledgeEntries(entry, knowledgeEntries),
      relatedLearningPathEntries: getRelatedLearningPathEntries(entry, learningPathEntries),
      relatedProjectEntries: getRelatedProjectEntries(entry, projectEntries),
      relatedTechnologyEntries: getRelatedTechnologyEntries(entry, technologyEntries),
    } satisfies CertificationStaticPathProps,
  }));
};
