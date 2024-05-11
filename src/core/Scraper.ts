import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { RequireAtLeastOne } from '../types/utils';

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

    this.id = id;
    this.name = name;
  }
}
