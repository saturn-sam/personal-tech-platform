export const isActivePath = (currentPath: string, href: string): boolean => {
  if (href === '/') {
    return currentPath === href;
  }

  return currentPath === href || currentPath.startsWith(href);
};
