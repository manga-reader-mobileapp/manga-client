"use client";

import { Manga } from "@/type/types";
import MangaCard from "./mangaCard";
import { useRouter } from "next/navigation";

export default function MangaList({ mangaData }: { mangaData: Manga[] }) {
  const { push } = useRouter();

  if (!mangaData || mangaData.length === 0) {
    return (
      <div className="flex justify-center items-center py-10">
        <p className="text-white text-lg text-center">Não possui mangás.</p>
      </div>
    );
  }

  return (
    <div className="max-h-[500px] scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-purple-200 rounded-md p-2">
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {mangaData.map((manga, i) => (
          <MangaCard
            key={i}
            title={manga.title}
            img={manga.img}
            chapters={manga.chapters.toString()}
            onClick={() => push(`/reader/library/read/${manga.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
