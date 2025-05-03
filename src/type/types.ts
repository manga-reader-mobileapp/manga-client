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
  chapters: string;
  source: string;
  sourceUrl: string;
  sourceName?: string;
  url: string;
  isFavorite?: boolean;
  lastChapter?: string;
};

export type Chapter = {
  title: string;
  url: string;
  date: string;
};

export type Page = {
  imageUrl: string;
  pageNumber: number;
};

export type ObjectPages = {
  totalPages: number;
  images: Page[];
};
