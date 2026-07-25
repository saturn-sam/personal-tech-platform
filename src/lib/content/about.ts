import { getCollection, type CollectionEntry } from 'astro:content';

import { getPublishedCollectionEntries } from './queries';

export type AboutEntry = CollectionEntry<'about'>;
export type AboutData = AboutEntry['data'];
export type AboutSection = AboutData['sections'][number];
export type AboutSectionId = AboutSection['id'];

export type AboutProjectEntry = CollectionEntry<'projects'>;
export type AboutTechnologyEntry = CollectionEntry<'technologies'>;
export type AboutCertificationEntry = CollectionEntry<'certifications'>;

interface AboutTechnologyGroupInput {
  readonly technologies: readonly string[];
  readonly title: string;
}

export interface AboutResolvedTechnologyGroup {
  readonly entries: readonly AboutTechnologyEntry[];
  readonly title: string;
}

const createSlugLookup = <Entry extends { data: { slug: string } }>(
  entries: readonly Entry[],
): Map<string, Entry> => new Map(entries.map((entry) => [entry.data.slug, entry]));

const resolveSelectedEntries = <Entry extends { data: { slug: string } }>(
  slugs: readonly string[],
  lookup: ReadonlyMap<string, Entry>,
): Entry[] => {
  const resolvedEntries: Entry[] = [];

  slugs.forEach((slug) => {
    const entry = lookup.get(slug);

    if (entry) {
      resolvedEntries.push(entry);
    }
  });

  return resolvedEntries;
};

export const getAboutPageEntry = async (): Promise<AboutEntry> => {
  const entries = await getCollection('about');
  const [entry] = entries;

  if (!entry) {
    throw new Error('Missing src/content/about/about.mdx content entry.');
  }

  return entry;
};

export const getAboutProjectEntries = async (
  slugs: readonly string[],
): Promise<AboutProjectEntry[]> => {
  const entries = await getPublishedCollectionEntries('projects');
  const lookup = createSlugLookup(entries);

  return resolveSelectedEntries(slugs, lookup);
};

export const getAboutCertificationEntries = async (
  section: AboutData['certifications'],
): Promise<AboutCertificationEntry[]> => {
  const entries = await getPublishedCollectionEntries('certifications');

  if (section.mode === 'all') {
    return [...entries].sort(
      (firstEntry, secondEntry) =>
        secondEntry.data.certificationDate.getTime() - firstEntry.data.certificationDate.getTime(),
    );
  }

  const lookup = createSlugLookup(entries);

  return resolveSelectedEntries(section.slugs, lookup);
};

export const getAboutTechnologyGroups = async (
  groups: readonly AboutTechnologyGroupInput[],
): Promise<AboutResolvedTechnologyGroup[]> => {
  const entries = await getPublishedCollectionEntries('technologies');
  const lookup = createSlugLookup(entries);

  return groups
    .map((group) => ({
      entries: resolveSelectedEntries(group.technologies, lookup),
      title: group.title,
    }))
    .filter((group) => group.entries.length > 0);
};
