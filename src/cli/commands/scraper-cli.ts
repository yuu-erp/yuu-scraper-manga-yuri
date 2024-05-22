import { Command } from 'commander';
import inquirer from 'inquirer';
// import { mangaActions } from '../../actions/manga';
import { MangaScraper } from '../../core/MangaScraper';
import scrapers, { getScraper } from '../../scrapers';
import { readFile } from '../../utils';
// import { insertData } from '../../core/Action';

export default (program: Command) => {
  return program
    .command('scraper')
    .description('Generate scraper file.')
    .action(async () => {
      const { id, type } = await inquirer.prompt([
        {
          type: 'list',
          message: 'What is the type of the scraper?',
          name: 'type',
          choices: [
            {
              name: 'Manga',
              value: 'manga',
            },
            {
              name: 'Anime',
              value: 'anime',
            },
          ],
        },
        {
          type: 'list',
          message: "What's the ID of the scraper?",
          name: 'id',
          choices: (answers) => {
            const allScrapers =
              answers.type === 'manga' ? scrapers.manga : scrapers.manga;
            return Object.values(allScrapers).map((value: any) => ({
              name: value.name,
              value: value.id,
            }));
          },
        },
      ]);
      // We do not support anime scraper yet
      if (type === 'anime') {
        throw new Error(`We do not support anime scraper yet: ${id}`);
      }
      const scraper = getScraper(id);
      // await scraper.init();

      const mangaScraper = scraper as MangaScraper;
      const sourcesManga = await readFileAndFallback(`./data/${id}.json`, () =>
        mangaScraper.scrapeAllMangaPages(),
      );
      console.log('sourcesManga: ', sourcesManga);
      // const mergedSources = await readFileAndFallback(
      //   `./data/${id}-full.json`,
      //   () => mangaScraper.scrapeAnilist(sourcesManga),
      // );
      // await insertData(mergedSources, mangaActions, 'anilistId');
    });
};

const readFileAndFallback = <T>(
  path: string,
  fallbackFn?: () => Promise<T>,
) => {
  const fileContent: T = JSON.parse(readFile(path));
  if (!fileContent) return fallbackFn();
  return fileContent;
};
