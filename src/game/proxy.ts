import { FetchClient } from '@/lib/fetch-client';
import { parseWikiPage } from './parser';

export const fetchClient = new FetchClient({
  baseUrl: '/api/wiki-stack',
  baseHeaders: {
    accept: 'text/html, text/plain',
  },
});

function computeProxyPath(url: string) {
  return `v0/proxy?url=${encodeURIComponent(url)}`;
}

export async function fetchPageData(url: string) {
  const proxyResponse = await fetchClient.api.get(computeProxyPath(url));
  const resolvedUrl = proxyResponse.headers.get('X-Resolved-Url');

  if (!resolvedUrl) {
    throw new Error(`Failed to resolve URL for ${url}`);
  }

  const html = await proxyResponse.text();
  if (!html) {
    throw new Error(`Failed to fetch HTML for ${url}`);
  }

  return parseWikiPage(resolvedUrl, html);
}

export function isLoadingPageData(url: string) {
  return fetchClient.isLoading('GET', computeProxyPath(url));
}
