const normalizeSiteUrl = (value: string | undefined): string | undefined => {
  if (!value) {
    return undefined;
  }

  const normalized = value.trim();

  if (!normalized) {
    return undefined;
  }

  return normalized.endsWith('/') ? normalized.slice(0, -1) : normalized;
};

const defaultSiteUrl = 'https://samrat.pages.dev';
const resolvedSiteUrl =
  normalizeSiteUrl(process.env.PUBLIC_SITE_URL) ??
  normalizeSiteUrl(process.env.SITE_URL) ??
  defaultSiteUrl;

export const siteConfig = {
  name: 'PTKP',
  fullName: 'Personal Technical Knowledge Platform',
  description:
    'A static-first technical knowledge platform for engineering documentation, projects, and learning resources.',
  author: 'Md. Samrat Uz Zaman',
  language: 'en',
  locale: 'en_US',
  url: resolvedSiteUrl,
  openGraphImage: '/assets/og/homepage.svg',
  socialLinks: [
    { label: 'GitHub', href: 'https://github.com/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
    { label: 'RSS', href: '/rss.xml' },
  ],
  footer: {
    title: 'Lifetime student.',
    description: 'Always learning. Always building. Always sharing.',
    copyrightLabel: 'Copyright',
    navigationLabel: 'Footer navigation',
    statements: [
      'Every deployment teaches a lesson.',
      'Every problem has a solution.',
      'Every solution deserves documentation.',
    ],
    sections: [
      {
        title: 'Platform',
        links: [
          { label: 'About', href: '/about/' },
          { label: 'Projects', href: '/projects/' },
          { label: 'Articles', href: '/articles/' },
          { label: 'Lab Notes', href: '/lab-notes/' },
          { label: 'Search', href: '/search/' },
        ],
      },
      {
        title: 'Knowledge',
        links: [
          { label: 'Technologies', href: '/technologies/' },
          { label: 'Certifications', href: '/certifications/' },
          { label: 'Resources', href: '/resources/' },
          { label: 'Learning Paths', href: '/learning-paths/' },
        ],
      },
      {
        title: 'Social',
        links: [
          { label: 'GitHub', href: 'https://github.com/' },
          { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
          { label: 'RSS', href: '/rss.xml' },
        ],
      },
    ],
  },
} as const;
