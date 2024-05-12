import cheerio from 'cheerio';
import { MangaScraper } from '../../core/MangaScraper';
import { SourceManga } from '../../types/data';
// import { fulfilledPromises } from '../../utils';
export default class YurinekoManga extends MangaScraper {
  constructor() {
    super('yurineko', 'Yurineko', { baseURL: 'https://yurineko.net/' });
  }
  async scrapeMangaPage(page: number): Promise<SourceManga> {
    try {
      const data = await this.getHtmlInPuppeteer(`?page=${page}`);
      const $ = cheerio.load(data);
      const mangaList = $('.ant-row img');
      console.log('YurinekoManga - scrapeMangaPage: ', mangaList.length);
      // return fulfilledPromises(
      //   mangaList.toArray().map((el) => {
      //     const manga = $(el);
      //     const sourceId = manga.attr('src').split('/')[4];

      //     console.log('YurinekoManga - scrapeMangaPage: ', sourceId);
      //   }),
      // );
      return this.scrapeManga('3444');
    } catch (error) {
      console.log(error);
    }
  }

  async scrapeManga(sourceId: string): Promise<SourceManga | any> {
    const data = await this.getHtmlInPuppeteer(`manga/${sourceId}`);
    const $ = cheerio.load(data);
    const tenKhacElement = $('p.text-md.font-normal').eq(0).text();
    const tenKhac = tenKhacElement.split(':')[1].trim();
    console.log('tenKhac: ', tenKhac);
  }
}
