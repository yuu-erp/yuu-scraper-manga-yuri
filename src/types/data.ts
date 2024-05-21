import { MediaArgs } from './anilist';

export interface SourceManga {
  titles: string[];
  chapters: SourceChapter[];
  sourceId: string;
  sourceMediaId: string;
  anilistId?: number;
  metadata?: MediaArgs;
}

export type MediaUnit = {
  name: string;
  sourceId: string;
  sourceMediaId: string;
  slug: string;
  sourceConnectionId: string;
  published?: boolean;
  section?: string;
};

export interface ChapterImages {
  image: string;
  useProxy: boolean;
}
export interface SourceChapter {
  name: string;
  sourceChapterId: string;
  sourceMediaId: string;
  section?: string;
  images: any[];
}

export interface SourceMediaConnection {
  id: string;
  mediaId: number;
  sourceMediaId: string;
  sourceId: string;
}

export interface Chapter extends MediaUnit {
  sourceChapterId: string;
}

export interface Manga {
  anilistId: number;
  chapters: Chapter[];
  sourceMangaConnection: SourceMediaConnection;
}

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

export type ImageSource = {
  image: string;
  useProxy?: boolean;
  proxy?: Proxy;
};

export type GetImagesQuery = {
  source_id: string;
  source_media_id: string;
  chapter_id: string;
  request: Request;
};
