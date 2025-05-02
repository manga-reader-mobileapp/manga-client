"use client";

import MangaCard from "./mangaCard";

export type MangaCardData = {
  id: string;
  title: string;
  img: string;
  chapters: string;
};

export default function MangaList({
  mangaData,
}: {
  mangaData: MangaCardData[];
}) {
  if (!mangaData || mangaData.length === 0) {
    return (
      <div className="flex justify-center items-center py-10">
        <p className="text-white text-lg text-center">Não possui mangás.</p>
      </div>
    );
  }

  return (
    <div className="max-h-[500px] scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-purple-200 rounded-md p-2">
      <div className="grid grid-cols-3 gap-2">
        {mangaData.map((manga) => (
          <MangaCard
            key={manga.id}
            title={manga.title}
            img={manga.img}
            chapters={manga.chapters}
          />
        ))}
      </div>
    </div>
  );
}
