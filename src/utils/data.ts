import { Manga, SourceManga } from '../types/data';

export type ConnectionArgs = {
  sourceId: string;
  sourceMediaId: string;
  mediaId: number;
};

export type ChapterArgs = {
  name: string;
  sourceMediaId: string;
  sourceId: string;
  sourceChapterId: string;
};

export const mergeMangaConnection = ({
  mediaId,
  sourceId,
  sourceMediaId,
}: ConnectionArgs) => ({
  id: `${sourceMediaId}-${sourceId}`,
  mediaId,
  sourceMediaId,
  sourceId,
});

export const mergeMangaChapter = ({
  name,
  sourceMediaId,
  sourceId,
  sourceChapterId,
}: ChapterArgs) => ({
  name: name,
  sourceConnectionId: `${sourceMediaId}-${sourceId}`,
  sourceMediaId,
  sourceChapterId,
  sourceId,
  slug: `${sourceId}-${sourceChapterId}`,
});

export const mergeMangaInfo = (
  source: SourceManga,
  anilistId: number,
): Manga => {
  return {
    anilistId,
    sourceMangaConnection: mergeMangaConnection({
      mediaId: anilistId,
      sourceId: source.sourceId,
      sourceMediaId: source.sourceMediaId,
    }),
    chapters: source.chapters.map((chapter) =>
      mergeMangaChapter({
        name: chapter.name,
        sourceMediaId: source.sourceMediaId,
        sourceId: source.sourceId,
        sourceChapterId: chapter.sourceChapterId,
      }),
    ),
  };
};
