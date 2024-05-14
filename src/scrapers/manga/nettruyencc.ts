import cheerio from 'cheerio';
import { MangaScraper } from '../../core/MangaScraper';
import { SourceChapter } from '../../types/data';
import { fulfilledPromises } from '../../utils';

export default class ManganettruyenccScraper extends MangaScraper {
  constructor() {
    // Pass axiosConfig to the parent class
    super('nettruyencc', 'Nettruyencc', {
      baseURL: 'https://nettruyencc.com',
    });

    // Languages that the source supports (Two letter code)
    // See more: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
    this.locales = [];
  }

  shouldMonitorChange(oldPage: string, newPage: string): boolean {
    if (!oldPage || !newPage) return false;

    const selector = '.items .item:first-child';

    const $old = cheerio.load(oldPage);
    const $new = cheerio.load(newPage);

    const oldTitle = $old(selector).find('h3').text().trim();
    const newTitle = $new(selector).find('h3').text().trim();

    return oldTitle !== newTitle;
  }

  async scrapeMangaPage(page: number): Promise<any[]> {
    try {
      const { data } = await this.client.get('/?page=' + page);

      const $ = cheerio.load(data);
      const mangaList = $('.items .item');

      return fulfilledPromises(
        mangaList.toArray().map((el) => {
          const manga = $(el);
          const slug = this.urlToSourceId(manga.find('a').attr('href'));
          return this.scrapeManga(slug);
        }),
      );
    } catch (err) {
      console.log('scrapeMangaPage - err: ', err);
    }
  }

  async scrapeManga(sourceId: string): Promise<any> {
    const { data } = await this.client.get(`/truyen-tranh/${sourceId}`);

    const $ = cheerio.load(data);

    const blacklistKeys = ['truyện chữ'];

    const mainTitle = $('.title-detail').text().trim();
    const altTitle = this.parseTitle($('.other-name').text().trim());

    const allTitles = [mainTitle, ...altTitle];
    const { titles } = this.filterTitles(allTitles);

    if (
      allTitles.some((title) =>
        blacklistKeys.some((key) => title.toLowerCase().includes(key)),
      )
    ) {
      return null;
    }

    const chapters: SourceChapter[] = $('div.chapter')
      .toArray()
      .map((el) => {
        const chapter = $(el).find('a');
        const chapterName = chapter.text().trim();
        const chapter_id = chapter.data('id').toString();

        return {
          name: chapterName,
          sourceChapterId: chapter_id,
          sourceMediaId: sourceId,
        };
      });

    return {
      chapters,
      sourceId: this.id,
      sourceMediaId: sourceId,
      titles,
    };
  }

  urlToSourceId(url: string) {
    const splitted = url.split('/');
    return splitted[splitted.length - 1];
  }
}
