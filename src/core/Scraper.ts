import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { RequireAtLeastOne } from '../types/utils';
import Monitor from './Monitor';
import { isVietnamese } from '../utils';
import { SourceManga } from '../types/data';
import logger from '../logger';
import PostgresDB from '../database/postgresDB';
import { DatabaseConfig } from '../configs/database-configs';
export interface Proxy {
  ignoreReqHeaders?: boolean;
  followRedirect?: boolean;
  redirectWithProxy?: boolean;
  decompress?: boolean;
  appendReqHeaders?: Record<string, string>;
  appendResHeaders?: Record<string, string>;
  deleteReqHeaders?: string[];
  deleteResHeaders?: string[];
}

export default class Scraper {
  client: AxiosInstance;
  baseURL: string;
  id: string;
  name: string;
  proxy: Proxy;
  monitor: Monitor;
  locales: string[];
  blacklistTitles: string[];
  scrapingPages: number;
  postgresDB: PostgresDB;
  constructor(
    id: string,
    name: string,
    axiosConfig: RequireAtLeastOne<AxiosRequestConfig, 'baseURL'>,
  ) {
    const config = {
      headers: {
        referer: axiosConfig.baseURL,
        origin: axiosConfig.baseURL,
      },
      timeout: 20000,
      ...axiosConfig,
    };
    this.client = axios.create(config);
    this.baseURL = axiosConfig.baseURL;

    const defaultMonitorRequest = async () => {
      console.log('defaultMonitorRequest');
      const { data } = await this.client.get('/');
      return data;
    };
    this.monitor = new Monitor(
      defaultMonitorRequest,
      this.shouldMonitorChange.bind(this),
    );
    this.id = id;
    this.name = name;
    this.blacklistTitles = ['live action'];
    this.scrapingPages = 2;

    this.postgresDB = new PostgresDB(DatabaseConfig);
  }

  /**
   * Run this method to push scraper's info to Supabase
   */
  async init() {
    await this.postgresDB.connect();
    await this.postgresDB.deleteTable('manga_source');
    await this.postgresDB.deleteTable('chapters');
    await this.postgresDB.disconnect();
    return;
  }

  /**
   * The monitor will run this method to check if the monitor should run onChange
   * (defined in cron/fetch)
   * @param oldPage old page that the monitor requested before
   * @param newPage new page that the monitor just requested
   * @returns boolean to let the monitor decided if the onChange function should run.
   */
  shouldMonitorChange(_oldPage: any, _newPage: any): boolean {
    return false;
  }
  /**
   *
   * @param titles an array of titles
   * @returns titles that are not Vietnamese and a Vietnamese title
   */
  protected filterTitles(titles: string[]) {
    const totalTitles = [...new Set(titles)].filter(
      (title) => !this.blacklistTitles.includes(title.toLowerCase()),
    );

    const vietnameseTitle = totalTitles.filter(isVietnamese)[0] || null;
    const nonVietnameseTitles = totalTitles.filter(
      (title) => !isVietnamese(title),
    );

    return {
      titles: nonVietnameseTitles,
      vietnameseTitle,
    };
  }
  /**
   *
   * @param path pattern of the parser (e.g. /anime/:id)
   * @param url the url or path (e.g. /anime/23)
   * @returns object with the matched params (e.g. { id: 23 })
   */
  parseTitle(title: string, separators = ['|', ',', ';', '-', '/']) {
    const separator = separators.find((separator) => title.includes(separator));

    const regex = new RegExp(`\\${separator}\\s+`);

    return title
      .split(regex)
      .map((title) => title.trim())
      .filter((title) => title);
  }

  protected async scrapeAllPages(scrapeFn: (page: number) => Promise<any>) {
    const list = [];
    let isEnd = false;
    let page = 1;

    while (!isEnd) {
      try {
        const result = await scrapeFn(page).catch((err) =>
          logger.error('error', err),
        );

        if (!result) {
          isEnd = true;

          break;
        }

        console.log(`Scraped page ${page} - ${this.id}`);

        if (result.length === 0) {
          isEnd = true;

          break;
        }
        page++;

        list.push(result);
      } catch (err) {
        isEnd = true;
      }
    }

    return this.removeBlacklistSources(list.flat());
  }

  protected async removeBlacklistSources<T extends SourceManga>(sources: T[]) {
    return sources.filter((source) =>
      source?.titles.some((title) => !this.blacklistTitles.includes(title)),
    );
  }
}
