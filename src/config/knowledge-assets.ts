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
        'In-depth technical insights, practical engineering experiences, and production lessons that bridge theory with real-world enterprise infrastructure.',
      routeBase: '/articles/',
      seoTitle: 'Articles',
      seoDescription:
        'Explore expert articles on enterprise infrastructure, Kubernetes, VMware, cloud, storage, networking, automation, and platform engineering.',
      emptyTitle: 'No published articles',
      emptyDescription:
        'Thought-provoking technical articles are on the way. Check back soon for practical engineering insights.',
    },
    'lab-notes': {
      badgeLabel: 'Lab Note',
      indexTitle: 'Lab Notes',
      indexDescription:
        'Field-tested commands, troubleshooting techniques, validation procedures, and operational shortcuts collected from hands-on engineering practice.',
      routeBase: '/lab-notes/',
      seoTitle: 'Lab Notes',
      seoDescription:
        'Quick-reference operational notes for troubleshooting, validation, automation, and day-to-day platform administration.',
      emptyTitle: 'No published lab notes',
      emptyDescription:
        'Hands-on operational notes and proven troubleshooting references will be published here soon.',
    },
    'architecture-guides': {
      badgeLabel: 'Architecture Guide',
      indexTitle: 'Architecture Guides',
      indexDescription:
        'Production-ready reference architectures that explain design principles, technology choices, implementation strategies, and operational best practices.',
      routeBase: '/architecture/',
      seoTitle: 'Architecture Guides',
      seoDescription:
        'Enterprise architecture blueprints covering virtualization, Kubernetes, cloud platforms, networking, storage, security, and automation.',
      emptyTitle: 'No published architecture guides',
      emptyDescription:
        'Enterprise architecture blueprints and design guides will appear here after technical validation.',
    },
    'case-studies': {
      badgeLabel: 'Case Study',
      indexTitle: 'Case Studies',
      indexDescription:
        'Real implementation stories that capture business challenges, architectural decisions, deployment journeys, operational outcomes, and lessons learned.',
      routeBase: '/case-studies/',
      seoTitle: 'Case Studies',
      seoDescription:
        'Real-world enterprise infrastructure projects documenting implementation strategies, technical decisions, challenges, and measurable outcomes.',
      emptyTitle: 'No published case studies',
      emptyDescription:
        'Real engineering stories and implementation experiences will be published as projects reach completion.',
    },
    'learning-paths': {
      badgeLabel: 'Learning Path',
      indexTitle: 'Learning Paths',
      indexDescription:
        'Carefully curated learning journeys that transform complex technologies into structured, progressive, and practical mastery.',
      routeBase: '/learning-paths/',
      seoTitle: 'Learning Paths',
      seoDescription:
        'Guided learning roadmaps connecting articles, labs, architecture guides, and projects into complete technical learning experiences.',
      emptyTitle: 'No published learning paths',
      emptyDescription:
        'Guided learning journeys will be available once the first complete study roadmap is released.',
    },
  },
} as const;

export type KnowledgeAssetCollectionName = keyof typeof knowledgeAssetConfig.collections;
