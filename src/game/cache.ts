import type { Page } from './types';

const storageKey = 'wiki-stack-cache';
const defaultTtl = 1000 * 60 * 60 * 24 * 30; // 30 days

type Cache = Record<string, { page: Page, expiresAt: number }>;

// TODO: Just delete this?

function updateCache(cache: Cache) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(cache));
  } catch (error) {
    console.error('Error updating cache:', error);
    // TODO: Handle storage quota exceeded
  }
}

export function getPageFromCache(url: string): Page | null {
  const cache = localStorage.getItem(storageKey);
  if (!cache) {
    return null;
  }

  const parsedCache = JSON.parse(cache) as Cache;
  const cachedItem = parsedCache[url];

  if (!cachedItem) {
    return null;
  }

  if (cachedItem.expiresAt < Date.now()) {
    delete parsedCache[url];
    updateCache(parsedCache);
    return null;
  }

  return cachedItem.page;
}

export function setPageInCache(url: string, page: Page, ttl: number = defaultTtl) {
  const cache = localStorage.getItem(storageKey);
  const parsedCache = cache ? JSON.parse(cache) : {} as Cache;

  parsedCache[url] = {
    page,
    expiresAt: Date.now() + ttl,
  };

  updateCache(parsedCache);
}
