export const homepageConfig = {
  seo: {
    title: 'Samrat',
    description:
      'Enterprise infrastructure engineering, virtualization, Kubernetes, cloud architecture, automation, storage, networking, and DevSecOps knowledge from real-world production environments.',
    canonicalPath: '/',
  },
  hero: {
    name: 'Md. Samrat Uz Zaman',
    title:
      'Enterprise Infrastructure Engineer, Virtualization Specialist, Kubernetes Architect, DevSecOps Practitioner, Technical Author',
    introduction:
      'I design, deploy, automate, and operate enterprise infrastructure for mission-critical environments. This platform documents practical knowledge, production architectures, implementation experiences, and engineering lessons across VMware, Kubernetes, cloud, storage, networking, automation, observability, and modern platform engineering as well as cloud-native architecture.',
    primaryAction: {
      label: 'Browse Articles',
      href: '/articles/',
    },
    secondaryAction: {
      label: 'View Projects',
      href: '/projects/',
    },
    tertiaryAction: {
      label: 'Download Resume',
      href: '/downloads/Md_Samrat-Uz-Zaman_resume_60405.pdf',
      download: true,
    },
    actionsLabel: 'Homepage primary actions',
  },
  locale: 'en',
  sections: {
    featuredKnowledge: {
      title: 'Featured Knowledge',
      description:
        'Production-focused architecture guides, implementation notes, operational runbooks, and technical deep dives based on enterprise infrastructure projects and continuous learning.',
      collectionLabels: {
        'architecture-guides': 'Architecture Guide',
        articles: 'Article',
        'lab-notes': 'Lab Note',
        'case-studies': 'Case Study',
        'learning-paths': 'Learning Path',
      },
      collections: [
        'articles',
        'lab-notes',
        'architecture-guides',
        'case-studies',
        'learning-paths',
      ],
      limit: 4,
    },
    featuredProjects: {
      title: 'Featured Projects',
      description:
        'Real engineering projects covering enterprise virtualization, Kubernetes platforms, cloud infrastructure, storage modernization, automation, monitoring, and operational excellence.',
      statusLabel: 'Status',
      linkLabel: 'View Project',
      limit: 5,
    },
    technologyOverview: {
      title: 'Technology Overview',
      description:
        'Knowledge is organized by technology domain that I have to connect architecture, implementation, operations, automation, and troubleshooting into a unified engineering reference.',
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
        'Professional certifications that validate my technical expertise while supporting continuous learning across infrastructure, cloud, Kubernetes, virtualization, networking, automation, and security.',
      issuerLabel: 'Issuer',
      linkLabel: 'View Credential',
      limit: 3,
    },
    recentUpdates: {
      title: 'Recent Updates',
      description:
        'Latest technical articles, lab experiments, architecture references, implementation notes, and engineering insights published as the platform continues to evolve.',
      updatedLabel: 'Updated',
      collections: ['articles', 'lab-notes', 'case-studies'],
      limit: 4,
    },
  },
} as const;
