export interface NavigationItem {
  readonly label: string;
  readonly href: string;
}

export const primaryNavigation: readonly NavigationItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Articles', href: '/articles/' },
  { label: 'Projects', href: '/projects/' },
  { label: 'Case Studies', href: '/case-studies/' },
  { label: 'Lab Notes', href: '/lab-notes/' },
  { label: 'Certifications', href: '/certifications/' },
  { label: 'Technologies', href: '/technologies/' },
  { label: 'Resources', href: '/resources/' },
  { label: 'Search', href: '/search/' },
  { label: 'About', href: '/about/' },
] as const;
