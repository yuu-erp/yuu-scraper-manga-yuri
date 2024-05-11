import { Command } from 'commander';
import inquirer from 'inquirer';
import scrapers, { getScraper } from '../../scrapers';

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
      if (type === 'anime') {
        throw new Error(`We do not support anime scraper yet: ${id}`);
      }
      console.log('answers: ', { id, type });
      const scraper = getScraper(id);
      console.log('scraper: ', scraper);
    });
};
