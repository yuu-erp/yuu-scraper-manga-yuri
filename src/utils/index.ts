import path from 'path';
import fs from 'fs';

export const handlePath = (
  filePath: string,
  baseUrl: string = path.resolve(process.cwd(), './build/src'),
) => path.join(baseUrl, filePath);

export const readFile = (filePath: string, basePath?: string) => {
  const fileDir = handlePath(filePath, basePath);

  if (!fs.existsSync(fileDir)) return null;

  return fs.readFileSync(fileDir, 'utf-8');
};

export const fulfilledPromises = <T extends Promise<any>>(promises: T[]) =>
  Promise.allSettled(promises).then((results) =>
    results
      .filter((result) => result.status === 'fulfilled')
      .map((result) => (result as PromiseFulfilledResult<Awaited<T>>).value),
  );
