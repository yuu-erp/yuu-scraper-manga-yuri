import { AxiosRequestConfig } from 'axios';
import Scraper from './Scraper';
import { RequireAtLeastOne } from '../types/utils';

export class MangaScraper extends Scraper {
  constructor(
    id: string,
    name: string,
    axiosConfig: RequireAtLeastOne<AxiosRequestConfig, 'baseURL'>,
  ) {
    super(id, name, axiosConfig);
  }

  async scrapeAllMangaPages() {
    const data = await this.scrapeAllPages(this.scrapeMangaPage.bind(this));
    console.log('scrapeAllMangaPages - data: ', data);
  }

  async scrapeMangaPage(_page: number): Promise<any> {
    throw new Error('scrapeMangaPage Not implemented');
  }
}
