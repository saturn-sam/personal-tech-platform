import type { APIRoute } from 'astro';

import { siteConfig } from '@config/site';
import { getPublishedKnowledgeAssets } from '@lib/content/queries';
import { getEntryUrl, isRoutableCollection } from '@lib/content/relationships';

export const prerender = true;

const staticRoutes = [
  { path: '/', priority: '1.0' },
  { path: '/about/', priority: '0.6' },
  { path: '/articles/', priority: '0.9' },
  { path: '/lab-notes/', priority: '0.85' },
  { path: '/architecture/', priority: '0.9' },
  { path: '/projects/', priority: '0.9' },
  { path: '/technologies/', priority: '0.9' },
  { path: '/certifications/', priority: '0.8' },
  { path: '/resources/', priority: '0.8' },
  { path: '/learning-paths/', priority: '0.75' },
] as const;

const resolveUrl = (path: string): string => new URL(path, siteConfig.url).toString();

export const GET: APIRoute = async () => {
  const entries = await getPublishedKnowledgeAssets();
  const contentUrls = entries
    .filter((entry) => isRoutableCollection(entry.collection))
    .map((entry) => ({
      lastmod: entry.data.updatedDate.toISOString().slice(0, 10),
      path: getEntryUrl(entry),
      priority: '0.8',
    }));

  const sitemapEntries = [...staticRoutes, ...contentUrls]
    .map(
      (item) => `  <url>
    <loc>${resolveUrl(item.path)}</loc>
    ${'lastmod' in item ? `<lastmod>${item.lastmod}</lastmod>` : ''}
    <priority>${item.priority}</priority>
  </url>`,
    )
    .join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
