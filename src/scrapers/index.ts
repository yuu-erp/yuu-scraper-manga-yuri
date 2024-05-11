import fs from 'fs';
import { handlePath } from '../utils';
import { MangaScraper } from '../core/MangaScraper';

export type MangaScraperId = string;
export type AnimeScraperId = string;

const readScrapers = (path: string) => {
  const scraperFiles = fs
    .readdirSync(handlePath(path))
    .filter((file) => file.endsWith('.js'))
    .map((file) => file.replace('.js', ''));
  const scrapers = {};
  for (const file of scraperFiles) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { default: Scraper } = require(handlePath(`${path}/${file}`));
    scrapers[file] = new Scraper();
  }
  return scrapers;
};

const mangaScrapers: Record<MangaScraperId, MangaScraper> =
  readScrapers('./scrapers/manga');

export const getMangaScraper = (id: MangaScraperId) => {
  if (!(id in mangaScrapers)) {
    throw new Error(`Unknown scraper id: ${id}`);
  }

  return mangaScrapers[id];
};

export const getScraper = (id: MangaScraperId | AnimeScraperId) => {
  // We do not support anime scraper yet
  if (id in mangaScrapers) {
    return getMangaScraper(id);
  }

  throw new Error(`Unknown scraper id: ${id}`);
};

export default {
  manga: mangaScrapers,
};
