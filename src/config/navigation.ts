export interface NavigationItem {
  readonly label: string;
  readonly href: string;
}

export const primaryNavigation: readonly NavigationItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Articles', href: '/articles/' },
  { label: 'Projects', href: '/projects/' },
  { label: 'Technologies', href: '/technologies/' },
  { label: 'Learning Paths', href: '/learning-paths/' },
  { label: 'Certifications', href: '/certifications/' },
  { label: 'Resources', href: '/resources/' },
  { label: 'About', href: '/about/' },
] as const;
