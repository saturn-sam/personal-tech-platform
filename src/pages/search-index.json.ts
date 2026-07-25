import type { APIRoute } from 'astro';

import { getPublishedKnowledgeAssets } from '@lib/content/queries';
import { buildSearchRecords } from '@lib/search';

export const prerender = true;

export const GET: APIRoute = async () => {
  const entries = await getPublishedKnowledgeAssets();
  const records = buildSearchRecords(entries);

  return new Response(JSON.stringify(records), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
};
