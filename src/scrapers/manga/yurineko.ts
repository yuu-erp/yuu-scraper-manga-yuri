import { MangaScraper } from '../../core/MangaScraper';

export default class YurinekoManga extends MangaScraper {
  constructor() {
    super('yurineko', 'Yurineko', { baseURL: 'https://yurineko.net/' });
  }
  init() {
    console.log('YurinekoManga');
  }
}
