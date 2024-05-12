import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { RequireAtLeastOne } from '../types/utils';
import Monitor from './Monitor';

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
}
