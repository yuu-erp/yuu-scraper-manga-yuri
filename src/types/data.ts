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

export interface SourceChapter {
  name: string;
  sourceChapterId: string;
  sourceMediaId: string;
  section?: string;
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
