export type Category = {
  id: string;
  name: string;
  created_at: Date;
  orderKanban: number;
  updated_at: Date;
  _count?: {
    SavedManga: number;
  };
};

export type User = {
  id: string;
  name: string;
  email: string;
  created_at: Date;
};

export type Manga = {
  id: string;
  title: string;
  description: string;
  img: string;
  chapters: number;
  source: string;
  sourceUrl: string;
  url: string;
  isFavorite?: boolean;
  lastChapter?: number;
};
