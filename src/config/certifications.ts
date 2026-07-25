export const certificationConfig = {
  locale: 'en',
  routeBase: '/certifications/',
  badgeLabel: 'Certification',
  indexTitle: 'Certifications',
  indexDescription:
    'Validated technical knowledge connected to practical platform work, related technologies, and supporting documentation.',
  seoTitle: 'Certifications',
  seoDescription:
    'Certification records connected to PTKP technologies, projects, and knowledge assets.',
  emptyTitle: 'No published certifications',
  emptyDescription: 'Published certification records will appear here after review.',
  labels: {
    home: 'Home',
    certifications: 'Certifications',
    certificationMetadata: 'Certification metadata',
    issuer: 'Issuer',
    issued: 'Issued',
    expires: 'Expires',
    credentialId: 'Credential ID',
    verification: 'Verification',
    difficulty: 'Difficulty',
    skills: 'Skills Validated',
    technologies: 'Technologies Covered',
    relatedContent: 'Related content',
    relatedProjects: 'Related Projects',
    relatedProjectsEmpty:
      'Related projects will appear here when matching project records are published.',
    relatedKnowledge: 'Related Knowledge Assets',
    relatedKnowledgeEmpty:
      'Related Knowledge Assets will appear here when matching documentation is published.',
    relatedLearningPaths: 'Related Learning Paths',
    relatedLearningPathsEmpty:
      'Related learning paths will appear here when published learning paths reference this certification domain.',
    previous: 'Previous',
    next: 'Next',
    certificationNavigation: 'Certification navigation',
    copyCode: 'Copy',
    copiedCode: 'Copied',
    mermaidDiagram: 'Certification relationship diagram',
  },
} as const;
