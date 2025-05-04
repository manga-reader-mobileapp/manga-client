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
  categoryId?: string;
  sourceTitle?: string;
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

//history

export type MangaInfo = {
  id: string;
  title: string;
  img: string;
};

// Uma entrada individual no histórico de leitura
export type HistoryEntry = {
  id: string;
  manga: MangaInfo;
  chapter: string;
  time: string;
  updated_at: string;
};

// Grupo de entradas de histórico organizadas por data
export type HistoryGroup = {
  date: string;
  entries: HistoryEntry[];
};
