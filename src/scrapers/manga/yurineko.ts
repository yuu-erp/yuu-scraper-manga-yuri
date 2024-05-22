import { MangaScraper } from '../../core/MangaScraper';
import cheerio from 'cheerio';
import { fulfilledPromises } from '../../utils';

export default class MangaYurinekoScraper extends MangaScraper {
  constructor() {
    // Pass axiosConfig to the parent class
    super('yurineko', 'Yurineko', { baseURL: 'https://yurineko.net' });

    // Languages that the source supports (Two letter code)
    // See more: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
    this.locales = [];
  }

  async scrapeMangaPage(page: number) {
    try {
      const data = await this.clientPuppeteer(`/?page=${page}`);
      const $ = cheerio.load(data);
      const mangaList = $('.ant-row .ant-col');
      return fulfilledPromises(
        mangaList.toArray().map((el) => {
          const manga = $(el);
          const slug = this.urlToSourceId(manga.find('img').attr('src'));
          return this.scrapeManga(slug);
        }),
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  async scrapeManga(sourceId: string) {
    try {
      const data = await this.clientPuppeteer(`/manga/${sourceId}`);
      const $ = cheerio.load(data);
      const author = $('div.ant-row');
      console.log('scrapeManga - author: ', author.text());
    } catch (err) {
      throw new Error(err);
    }
  }

  urlToSourceId(url: string) {
    const splitted = url.split('/');
    return splitted[splitted.length - 2];
  }
}
