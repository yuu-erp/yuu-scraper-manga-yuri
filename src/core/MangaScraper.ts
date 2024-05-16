import { AxiosRequestConfig } from 'axios';
import Scraper from './Scraper';
import { RequireAtLeastOne } from '../types/utils';
import { MediaType } from '../types/anilist';
import { GetImagesQuery, ImageSource, Manga, SourceManga } from '../types/data';
import { readFile, writeFile } from '../utils';
import { getRetriesId } from '../utils/anilist';
import { mergeMangaInfo } from '../utils/data';

export class MangaScraper extends Scraper {
  type: MediaType.Manga;
  monitorURL: string;
  constructor(
    id: string,
    name: string,
    axiosConfig: RequireAtLeastOne<AxiosRequestConfig, 'baseURL'>,
  ) {
    super(id, name, axiosConfig);

    this.id = id;
    this.name = name;
    this.monitorURL = axiosConfig.baseURL;
    this.type = MediaType.Manga;
  }

  async scrapeAllMangaPages(): Promise<SourceManga[]> {
    const data = await this.scrapeAllPages(this.scrapeMangaPage.bind(this));

    writeFile(`./data/${this.id}.json`, JSON.stringify(data, null, 2));

    return data;
  }

  /**
   * Scrape data from anilist then merge it with data from source
   * @param sources sources of manga
   * @returns merged sources of manga
   */
  async scrapeAnilist(sources?: SourceManga[]): Promise<Manga[]> {
    const fullSources = [];
    if (!sources) {
      sources = JSON.parse(readFile(`./data/${this.id}.json`));
    }
    if (!sources?.length) {
      this.discordClient.logError({ message: 'No sources' });
      // throw new Error('No sources');
      return;
    }
    for (const source of sources) {
      if (!source?.titles?.length) continue;
      let anilistId: number;
      if (source.anilistId) {
        anilistId = source.anilistId;
      } else {
        anilistId = await getRetriesId(
          source.titles,
          MediaType.Manga,
          source.metadata,
        );
      }
      if (!anilistId) continue;
      fullSources.push(mergeMangaInfo(source, anilistId));
    }
    writeFile(
      `./data/${this.id}-full.json`,
      JSON.stringify(fullSources, null, 2),
    );

    return fullSources;
  }

  async scrapeMangaPage(_page: number): Promise<any> {
    throw new Error('scrapeMangaPage Not implemented');
  }

  async getImages(_ids: GetImagesQuery): Promise<ImageSource[]> {
    throw new Error('getImagesNot implemented');
  }
}
