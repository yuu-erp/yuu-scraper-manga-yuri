import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { RequireAtLeastOne } from '../types/utils';
import Monitor from './Monitor';
import puppeteer, { KnownDevices } from 'puppeteer';
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
  }

  /**
   * Run this method to push scraper's info to Supabase
   */
  init() {
    return {
      name: this.name,
      id: this.id,
      locales: this.locales,
    };
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

  protected async scrapePages(
    scrapeFn: (page: number) => Promise<any>,
    numOfPages: number,
  ) {
    const list = [];

    for (let page = 1; page <= numOfPages; page++) {
      const result = await scrapeFn(page);
      console.log(`Scraped page ${page} [${this.id}]`);

      // @ts-ignore
      if (result?.length === 0) {
        break;
      }

      list.push(result);
    }
    console.log('list: ', list);
  }

  protected async scrapeAllPages(scrapeFn: (page: number) => Promise<any>) {
    const list = [];
    let isEnd = false;
    let page = 1;

    while (!isEnd) {
      try {
        const result = await scrapeFn(page).catch((err) =>
          console.log('result - error: ', err),
        );
        console.log('Scraped page result: ', result);
        if (!result || result.length === 0) {
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

    console.log('list: ', list);
    return list;
  }

  async getHtmlInPuppeteer(url: string): Promise<any> {
    console.log('`${this.baseURL}${url}`', `${this.baseURL}${url}`);
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--disable-infobars',
        '--disable-blink-features=AutomationControlled',
      ],
      devtools: false,
      ignoreDefaultArgs: ['--enable-automation'],
    });
    const page = (await browser.pages())[0];
    await page.setRequestInterception(true);
    page.on('request', (req: any) => {
      if (req.resourceType() == 'font') {
        req.abort();
      } else {
        req.continue();
      }
    });
    await page.evaluateOnNewDocument(() => {
      // Pass webdriver check
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false,
      });
    });

    await page.emulate(KnownDevices['iPhone 13']);
    // Navigate to a website to see the user agent in action
    await page.goto(`${this.baseURL}${url}`, {
      waitUntil: 'domcontentloaded',
    });
    await page.waitForTimeout(5000);
    const html = await page.content();
    await browser.close();
    return html;
  }
}
