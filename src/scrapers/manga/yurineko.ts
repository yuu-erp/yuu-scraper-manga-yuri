import cheerio from 'cheerio';
import { MangaScraper } from '../../core/MangaScraper';
import { SourceManga } from '../../types/data';
import { fulfilledPromises } from '../../utils';
export default class YurinekoManga extends MangaScraper {
  constructor() {
    super('yurineko', 'Yurineko', { baseURL: 'https://yurineko.net/' });
  }
  async scrapeMangaPage(page: number): Promise<SourceManga[]> {
    try {
      const data = await this.getHtmlInPuppeteer(`?page=${page}`);
      const $ = cheerio.load(data);
      const mangaList = $('.ant-row img');
      console.log('YurinekoManga - scrapeMangaPage: ', mangaList.length);
      return fulfilledPromises(
        mangaList
          .toArray()
          .slice(0, 5)
          .map((el) => {
            const manga = $(el);
            const sourceId = manga.attr('src').split('/')[4];
            return this.scrapeManga(sourceId);
          }),
      );
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async scrapeManga(sourceId: string): Promise<SourceManga | any> {
    console.log('scrapeManga - sourceId: ', sourceId);
    const data = await this.getHtmlInPuppeteer(`manga/${sourceId}`);
    const $ = cheerio.load(data);
    const titleElement = $('p.text-md.font-normal').eq(0).text();
    const title = titleElement.split(':')[1].trim();
    const titles = title.split('; ');
    return {
      titles,
    };
  }
}
