import path from 'path';
import fs from 'fs';
import pick from 'lodash/pick';

export const handlePath = (
  filePath: string,
  baseUrl: string = path.resolve(process.cwd(), './build/src'),
) => path.join(baseUrl, filePath);

export const readFile = (filePath: string, basePath?: string) => {
  const fileDir = handlePath(filePath, basePath);

  if (!fs.existsSync(fileDir)) return null;

  return fs.readFileSync(fileDir, 'utf-8');
};

export const writeFile = (
  filePath: string,
  data: string,
  basePath?: string,
) => {
  const pathname = filePath.replace(/^\.*\/|\/?[^/]+\.[a-z]+|\/$/g, ''); // Remove leading directory markers, and remove ending /file-name.extension

  const pathDir = handlePath(pathname, basePath);

  if (!fs.existsSync(pathDir)) {
    fs.mkdirSync(pathDir, { recursive: true });
  }

  const fileDir = handlePath(filePath, basePath);

  fs.writeFileSync(fileDir, data, { flag: 'w' });
};

export const fulfilledPromises = <T extends Promise<any>>(promises: T[]) =>
  Promise.allSettled(promises).then((results) =>
    results
      .filter((result) => result.status === 'fulfilled')
      .map((result) => (result as PromiseFulfilledResult<Awaited<T>>).value),
  );

export const isVietnamese = (text: string) => {
  const REGEX =
    /à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ|è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ|ì|í|ị|ỉ|ĩ|ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ|ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ|ỳ|ý|ỵ|ỷ|ỹ|đ/g;

  return REGEX.test(text.toLowerCase());
};
export const pickArrayOfObject = <T, K extends keyof T>(data: T[], keys: K[]) =>
  data.map((each) => pick(each, keys));
