export const knowledgeAssetConfig = {
  locale: 'en',
  labels: {
    home: 'Home',
    published: 'Published',
    updated: 'Updated',
    reviewed: 'Reviewed',
    readingTime: 'Reading time',
    difficulty: 'Difficulty',
    author: 'Author',
    revision: 'Revision',
    status: 'Status',
    tags: 'Tags',
    technologies: 'Technologies',
    categories: 'Categories',
    tableOfContents: 'Table of contents',
    noTableOfContents: 'Section links appear when this page includes headings.',
    editMetadata: 'Edit metadata',
    relatedContent: 'Related content',
    relatedEmpty:
      'Related content references are reserved for the relationship view and will appear here when published.',
    relatedWithCount: 'Related content references are available in metadata.',
    previous: 'Previous',
    next: 'Next',
    collectionNavigation: 'Knowledge asset navigation',
    copyCode: 'Copy',
    copiedCode: 'Copied',
    mermaidDiagram: 'Mermaid diagram',
  },
  collections: {
    articles: {
      badgeLabel: 'Article',
      indexTitle: 'Articles',
      indexDescription:
        'Long-form technical writing focused on architecture, platform operations, and engineering decisions.',
      routeBase: '/articles/',
      seoTitle: 'Articles',
      seoDescription:
        'Technical articles about infrastructure, Kubernetes, virtualization, cloud, and platform engineering.',
      emptyTitle: 'No published articles',
      emptyDescription: 'Published technical articles will appear here after editorial review.',
    },
    'lab-notes': {
      badgeLabel: 'Lab Note',
      indexTitle: 'Lab Notes',
      indexDescription:
        'Concise operational references for commands, checks, troubleshooting notes, and repeatable workflows.',
      routeBase: '/lab-notes/',
      seoTitle: 'Lab Notes',
      seoDescription:
        'Practical lab notes for infrastructure troubleshooting, Kubernetes operations, and platform validation.',
      emptyTitle: 'No published lab notes',
      emptyDescription: 'Published lab notes will appear here after operational validation.',
    },
    'architecture-guides': {
      badgeLabel: 'Architecture Guide',
      indexTitle: 'Architecture Guides',
      indexDescription:
        'Production-focused architecture references with business context, requirements, diagrams, and operating guidance.',
      routeBase: '/architecture/',
      seoTitle: 'Architecture Guides',
      seoDescription:
        'Architecture guides for enterprise platforms, infrastructure operations, and secure technical systems.',
      emptyTitle: 'No published architecture guides',
      emptyDescription: 'Published architecture guides will appear here after technical review.',
    },
  },
} as const;

export type KnowledgeAssetCollectionName = keyof typeof knowledgeAssetConfig.collections;
