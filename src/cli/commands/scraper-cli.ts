import { Command } from 'commander';
import inquirer from 'inquirer';
import scrapers, { getScraper } from '../../scrapers';
import { MangaScraper } from '../../core/MangaScraper';
import { readFile } from '../../utils';

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
      const dataInit = scraper.init();
      console.log('dataInit: ', dataInit);

      const mangaScraper = scraper as MangaScraper;
      console.log('mangaScraper: ', mangaScraper);
      const sources = await readFileAndFallback(`./data/${id}.json`, () =>
        mangaScraper.scrapeAllMangaPages(),
      );
      console.log('sources: ', sources);
    });
};

const readFileAndFallback = <T>(
  path: string,
  fallbackFn?: () => Promise<T>,
) => {
  const fileContent: T = JSON.parse(readFile(path));
  console.log(path, !!fileContent);

  if (!fileContent) return fallbackFn();
  return fileContent;
};
