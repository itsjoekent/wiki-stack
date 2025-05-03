import type { Page } from './types';

export function randomArrayPick(options: string[], count: number): string[] {
  const picked = new Set<string>();
  while (picked.size < count) {
    const index = Math.floor(Math.random() * options.length);
    picked.add(options[index]);
  }
  return Array.from(picked);
}

export function randomArrayShuffle<T>(array: T[]): T[] {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export function pickDeckCards(page: Page) {
  const links = page.links.map((link) => link.url);
  const pickedLinks = randomArrayPick(links, 3);
  return randomArrayShuffle(pickedLinks);
}

export function formatTimeLeft(timeLeft: number): string {
  const seconds = Math.floor(timeLeft / 1000)
    .toString()
    .padStart(2, '0');
  const milliseconds = (timeLeft % 1000).toString().padStart(3, '0');
  return `${seconds}.${milliseconds}`;
}
