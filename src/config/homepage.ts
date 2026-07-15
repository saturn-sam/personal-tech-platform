export const homepageConfig = {
  seo: {
    title: 'Personal Technical Knowledge Platform',
    description:
      'Engineering knowledge, architecture notes, projects, and learning resources for infrastructure and platform engineers.',
    canonicalPath: '/',
  },
  hero: {
    name: 'Md. Samrat Uz Zaman',
    title: 'Infrastructure Engineer, Kubernetes Architect, and Technical Knowledge Author',
    introduction:
      'Focused on secure, resilient, and automated enterprise platforms across virtualization, Kubernetes, cloud, and infrastructure operations.',
    primaryAction: {
      label: 'Browse Articles',
      href: '/articles/',
    },
    secondaryAction: {
      label: 'View Projects',
      href: '/projects/',
    },
    actionsLabel: 'Homepage primary actions',
  },
  locale: 'en',
  sections: {
    featuredKnowledge: {
      title: 'Featured Knowledge',
      description:
        'Curated technical notes and architecture references selected for platform engineering readers.',
      collectionLabels: {
        'architecture-guides': 'Architecture Guide',
        articles: 'Article',
        'lab-notes': 'Lab Note',
        'learning-paths': 'Learning Path',
      },
      collections: ['articles', 'lab-notes', 'architecture-guides', 'learning-paths'],
      limit: 4,
    },
    featuredProjects: {
      title: 'Featured Projects',
      description:
        'Engineering implementations focused on enterprise platforms, automation, observability, and operations.',
      statusLabel: 'Status',
      linkLabel: 'View Project',
      limit: 5,
    },
    technologyOverview: {
      title: 'Technology Overview',
      description:
        'Technologies are grouped by domain so related knowledge can grow without changing the platform structure.',
      categories: [
        'Infrastructure',
        'Virtualization',
        'Containers',
        'Cloud',
        'DevOps',
        'Programming',
        'Databases',
        'Monitoring',
        'Networking',
      ],
    },
    certifications: {
      title: 'Certifications',
      description:
        'Credential records connect platform knowledge to verified technical domains and study paths.',
      issuerLabel: 'Issuer',
      linkLabel: 'View Credential',
      limit: 7,
    },
    recentUpdates: {
      title: 'Recent Updates',
      description: 'Recent articles and lab notes prepared for ongoing publication.',
      updatedLabel: 'Updated',
      collections: ['articles', 'lab-notes'],
      limit: 4,
    },
  },
} as const;
