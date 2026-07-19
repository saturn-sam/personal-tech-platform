export type PrefetchStrategy = 'hover';

const absoluteProtocolPattern = /^[a-z][a-z0-9+.-]*:/i;

export const getLinkPrefetchStrategy = (
  href: string | undefined,
  target?: '_blank' | '_self' | '_parent' | '_top',
): PrefetchStrategy | undefined => {
  if (!href || target === '_blank') {
    return undefined;
  }

  const normalizedHref = href.trim();

  if (
    !normalizedHref ||
    normalizedHref.startsWith('#') ||
    normalizedHref.startsWith('//') ||
    absoluteProtocolPattern.test(normalizedHref)
  ) {
    return undefined;
  }

  return normalizedHref.startsWith('/') ? 'hover' : undefined;
};
