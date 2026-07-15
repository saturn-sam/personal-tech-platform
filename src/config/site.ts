export const siteConfig = {
  name: 'PTKP',
  fullName: 'Personal Technical Knowledge Platform',
  description:
    'A static-first technical knowledge platform for engineering documentation, projects, and learning resources.',
  author: 'Md. Samrat Uz Zaman',
  language: 'en',
  url: undefined as string | undefined,
  openGraphImage: '/assets/og/homepage.svg',
  footer: {
    description: 'Documentation-first engineering knowledge, organized for long-term reference.',
    copyrightLabel: 'Copyright',
    navigationLabel: 'Footer navigation',
    linksLabel: 'Footer links',
    links: [
      { label: 'GitHub', href: 'https://github.com/' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
      { label: 'RSS', href: '/rss.xml' },
    ],
  },
} as const;
