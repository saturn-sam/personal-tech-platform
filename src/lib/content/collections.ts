export const contentCollectionNames = [
  'articles',
  'lab-notes',
  'architecture-guides',
  'projects',
  'technologies',
  'certifications',
  'resources',
  'learning-paths',
] as const;

export type ContentCollectionName = (typeof contentCollectionNames)[number];

export interface ContentCollectionDefinition {
  readonly assetType:
    | 'article'
    | 'lab-note'
    | 'architecture-guide'
    | 'project'
    | 'technology'
    | 'certification'
    | 'resource'
    | 'learning-path';
  readonly label: string;
}

export const contentCollections = {
  articles: {
    assetType: 'article',
    label: 'Articles',
  },
  'lab-notes': {
    assetType: 'lab-note',
    label: 'Lab Notes',
  },
  'architecture-guides': {
    assetType: 'architecture-guide',
    label: 'Architecture Guides',
  },
  projects: {
    assetType: 'project',
    label: 'Projects',
  },
  technologies: {
    assetType: 'technology',
    label: 'Technologies',
  },
  certifications: {
    assetType: 'certification',
    label: 'Certifications',
  },
  resources: {
    assetType: 'resource',
    label: 'Resources',
  },
  'learning-paths': {
    assetType: 'learning-path',
    label: 'Learning Paths',
  },
} satisfies Record<ContentCollectionName, ContentCollectionDefinition>;

export const isContentCollectionName = (value: string): value is ContentCollectionName =>
  contentCollectionNames.includes(value as ContentCollectionName);
