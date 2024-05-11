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
}
