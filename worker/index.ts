import { Hono } from 'hono';
const app = new Hono();

app.get('/api/wiki-stack/v0/proxy', async (c) => {
  const url = c.req.query('url');
  const decodedUrl = decodeURIComponent(url || '');

  if (!decodedUrl) {
    return c.text('Missing url parameter', 400);
  }

  if (!decodedUrl.startsWith('https://en.wikipedia.org/wiki/')) {
    return c.text('Invalid url', 400);
  }

  let urlObj: URL;

  try {
    urlObj = new URL(decodedUrl);
  } catch {
    return c.text('Invalid url', 400);
  }

  const fetchResponse = await fetch(urlObj, {
    headers: {
      accept: 'text/html, text/plain',
      'User-Agent': 'Wiki-Stack/0.0.1 (We come in peace)',
      'Accept-Language': 'en-US,en;q=0.9',
      Accept: 'text/html',
      Connection: 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    },
    redirect: 'follow',
    cf: {
      cacheEverything: true,
      cacheTtl: 60 * 60 * 24 * 30, // 30 days
    },
  });

  const response = new Response(fetchResponse.body, fetchResponse);
  response.headers.set('Cache-Control', 'public, max-age=2592000'); // 30 days
  response.headers.set('X-Resolved-Url', fetchResponse.url);

  return response;
});

export default app;
