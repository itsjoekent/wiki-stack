import { Cheerio, type CheerioAPI, load } from 'cheerio';
import { type Element } from 'domhandler';
import type { Page, PageLink } from './types';

// TODO: Rewrite this to use DOMParser instead of Cheerio
// new DOMParser();

function cleanWikiText(text: string, maxLength?: number): string {
  // Remove references like [1], [a], etc.
  text = text.replace(/\[\d+\]|\[\w+\]/g, '');

  text = text.replace(' ⓘ', '');

  if (typeof maxLength === 'number' && text.length > maxLength) {
    text = text.substring(0, maxLength - 3) + '...';
  }

  return text;
}

export function findPageDescription($: CheerioAPI): string {
  $('style').remove();
  const paragraphs = $('.mw-parser-output > p').toArray();

  for (const paragraph of paragraphs) {
    const content = $(paragraph).text().trim();
    if (content) {
      return cleanWikiText(content, 512);
    }
  }

  return '';
}

export function findLinkContext($element: Cheerio<Element>): string {
  const linkText = $element.text().trim();

  function recursiveSearch(
    $searchElement: Cheerio<Element>,
    index: number,
  ): string {
    if (index > 3) {
      return linkText;
    }

    const text = cleanWikiText($searchElement.text().trim(), 1024);
    if (text !== linkText) return text;

    return recursiveSearch($searchElement.parent(), index + 1);
  }

  return recursiveSearch($element.parent(), 0);
}

const testWikiImage = new RegExp('//upload.wikimedia.org/wikipedia/commons/');

export function parseWikiPage(url: string, html: string): Page {
  const urlObj = new URL(url);
  const language = urlObj.hostname.split('.')[0].toLowerCase();

  const $ = load(html);

  $('.navbox').remove();

  const title = $('#firstHeading')?.text();
  if (!title) throw new Error(`Title not found in ${url}`);

  const links: PageLink[] = [];

  $('.mw-body-content a')
    .not('.references a')
    .not('.refbegin a')
    .toArray()
    .forEach((element) => {
      const dirtyHref = $(element).attr('href');
      if (!dirtyHref) return;

      const hashIndex = dirtyHref.indexOf('#');
      const href =
        hashIndex !== -1 ? dirtyHref.substring(0, hashIndex) : dirtyHref;

      if (links.some((compare) => compare.url === href)) return;

      if (
        !href ||
        !href.startsWith('/wiki/') ||
        href === '/wiki/Main_Page' ||
        href.includes('Wikipedia:') ||
        href.includes('Special:') ||
        href.includes('Help:') ||
        href.includes('File:') ||
        href.includes('Category:') ||
        href.includes('Template:') ||
        href.includes('Template_talk:') ||
        href.includes('Talk:') ||
        href.includes('Portal:') ||
        href.includes('Digital_object_identifier')
      ) {
        return;
      }

      const url = `https://${language}.wikipedia.org${href}`;

      const context = findLinkContext($(element));
      links.push({ context, url });
    });

  const imageSources = $('img')
    .toArray()
    .map((element) => $(element).attr('src'))
    .filter(
      (src) => src && testWikiImage.test(src) && !src.includes('Sound-icon.svg'),
    ) as string[];

  const description = findPageDescription(load(html));

  return {
    title,
    description,
    imageSrc: imageSources[0] || '',
    imageAlt: title,
    url: urlObj.href,
    path: urlObj.pathname,
    links,
  };
}
