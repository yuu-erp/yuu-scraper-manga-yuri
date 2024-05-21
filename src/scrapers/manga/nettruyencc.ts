import { MangaScraper } from '../../core/MangaScraper';
import { SourceChapter, SourceManga } from '../../types/data';
// import { fulfilledPromises } from '../../utils';
import FormData from 'form-data';
import cheerio from 'cheerio'

export default class NettruyenScraper extends MangaScraper {
  constructor() {
    // Pass axiosConfig to the parent class
    super('nettruyencc', 'Nettruyencc', {
      baseURL: 'https://nettruyencc.com',
    });
    // Languages that the source supports (Two letter code)
    // See more: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
    this.locales = ['vi'];
    this.monitor.interval = 20 * 60 * 1000; // 20 minutes
  }

  shouldMonitorChange(oldPage: string, newPage: string): boolean {
    if (!oldPage || !newPage) return false;

    const selector = '.items .item:first-child';

    const $old = cheerio.load(oldPage);
    const $new = cheerio.load(newPage);

    const oldTitle = $old(selector).find('h3').text().trim();
    const newTitle = $new(selector).find('h3').text().trim();
    console.log({ oldTitle, newTitle });
    return oldTitle === newTitle;
  }

  async scrapeMangaPage(page: number): Promise<SourceManga[] | any> {
    // try {
    //   const { data } = await this.client.get('/?page=' + page);
    //   // const oldPage = JSON.parse(readFile('./data/oldPage.txt'));
    //   // if (this.shouldMonitorChange(oldPage, data)) {
    //   //   throw new Error('No update');
    //   // }
    //   // writeFile(`./data/oldPage.txt`, JSON.stringify(data, null, 2));
    //   const $ = cheerio.load(data);
    //   const mangaList = $('.items .item');
    //   return fulfilledPromises(
    //     mangaList.toArray().map((el) => {
    //       const manga = $(el);
    //       const slug = this.urlToSourceId(manga.find('a').attr('href'));
    //       return this.scrapeManga(slug);
    //     }),
    //   );
    // } catch (err) {
    //   console.log('scrapeMangaPage - err: ', err);
    // }
    try {
      console.log('page: ', page);
      const images = await this.getImages(
        'haite-kudasai-takamine-san/chuong-19/512037',
      );
      console.log('images: ', images);
      const uploadedImages = await this.getImageAndUpload(images);
      console.log('uploadedImages: ', uploadedImages);
    } catch (error) {
      console.log('error:', error);
    }
  }

  async scrapeManga(sourceId: string): Promise<SourceManga> {
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
    const chapters: SourceChapter[] = await Promise.all(
      $('div.chapter')
        .toArray()
        .map(async (el) => {
          const chapter = $(el).find('a');
          const chapterName = chapter.text().trim();
          const chapter_id = chapter.data('id').toString();
          const urlChapterImages = this.urlToChapterImages(
            chapter.attr('href'),
          );
          console.log('urlChapterImages: ', urlChapterImages);
          const images = await this.getImages(urlChapterImages);
          console.log('images: ', images);
          return {
            name: chapterName,
            sourceChapterId: chapter_id,
            sourceMediaId: sourceId,
            images: [],
          };
        }),
    );

    return {
      chapters,
      sourceId: this.id,
      sourceMediaId: sourceId,
      titles,
    };
  }

  async getImages(url: string): Promise<string[]> {
    const { data } = await this.client.get(`/truyen-tranh/${url}`);
    return this.composeImages(data);
  }

  async composeImages(html: string) {
    const $ = cheerio.load(html);
    const images = $('.page-chapter img'); // Chọn trực tiếp các thẻ img bên trong .page-chapter

    const imageUrls = images.toArray().map((el) => {
      const imageEl = $(el);
      const source = imageEl.attr('data-src') as string;
      const protocols = ['http', 'https'];
      const image = protocols.some((protocol) => source.includes(protocol))
        ? source
        : `https:${source}`;
      return image;
    });

    return imageUrls;
  }

  async getImageAndUpload(imageUrls: string[]) {
    try {
      const uploadedImages = [];
      for (const imageUrl of imageUrls) {
        const response = await this.client.get(imageUrl, {
          responseType: 'arraybuffer',
          headers: {
            'sec-ch-ua':
              '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
            Referer: 'https://nettruyencc.com/',
            'sec-ch-ua-mobile': '?0',
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'sec-ch-ua-platform': '"macOS"',
          },
        });

        console.log('response: ', response.data);
        const form = new FormData();
        const buffer = Buffer.from(response.data, 'binary');
        const filename = imageUrl.split('/').pop();

        form.append('file', buffer, filename);

        const uploadResponse = await this.client.post(
          'http://localhost:3000/upload',
          form,
          {
            headers: {
              ...form.getHeaders(),
            },
          },
        );

        uploadedImages.push(uploadResponse.data);

        // Chờ 2 giây trước khi thực hiện tải và upload ảnh tiếp theo
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      return uploadedImages;
    } catch (error) {
      console.error('Error downloading or uploading images:', error);
      throw error;
    }
  }

  urlToSourceId(url: string) {
    const splitted = url.split('/');
    return splitted[splitted.length - 1];
  }

  urlToChapterImages(url: string) {
    const splitted = url.split('/truyen-tranh/');
    return splitted[splitted.length - 1];
  }
}
