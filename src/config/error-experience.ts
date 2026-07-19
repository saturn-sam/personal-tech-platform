export const errorExperienceConfig = {
  notFound: {
    badgeLabel: '404',
    title: 'Page not found',
    description:
      'The page you requested could not be found. The address may be incorrect, the content may have moved, or the page may not be published yet.',
    recoveryTitle: 'Continue with a published section',
    recoveryDescription:
      'Return home, search the platform, or jump directly into one of the core PTKP collections.',
    primaryAction: {
      href: '/',
      label: 'Return to Home',
    },
    secondaryAction: {
      href: '/search/',
      label: 'Search the Platform',
      variant: 'secondary',
    },
    navigationLabel: 'Suggested navigation',
    links: [
      { href: '/articles/', label: 'Articles' },
      { href: '/projects/', label: 'Projects' },
      { href: '/technologies/', label: 'Technologies' },
      { href: '/certifications/', label: 'Certifications' },
      { href: '/resources/', label: 'Resources' },
    ],
  },
  search: {
    initial: {
      title: 'Start with a keyword',
      description:
        'Search for a topic, category, technology, or tag to discover the right knowledge asset.',
      primaryAction: {
        href: '/articles/',
        label: 'Browse Articles',
      },
      secondaryAction: {
        href: '/',
        label: 'Back to Home',
        variant: 'secondary',
      },
    },
    noResults: {
      title: 'No results found',
      description:
        'Try a broader keyword, remove a filter, or continue from a published section instead.',
      primaryAction: {
        href: '/technologies/',
        label: 'Browse Technologies',
      },
      secondaryAction: {
        href: '/',
        label: 'Back to Home',
        variant: 'secondary',
      },
    },
  },
} as const;
