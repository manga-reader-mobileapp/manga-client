"use client";

import { getUniqueManga } from "@/api/library/unique/getUniqueManga";
import { fetchChaptersFromMangalivre } from "@/api/sources/manga-livre/fetchChapters";
import { Button } from "@/components/ui/button";
import { Chapter, Manga } from "@/type/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BsGlobe2 } from "react-icons/bs";
import { FiShare2 } from "react-icons/fi";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import {
  IoCheckmarkSharp,
  IoHeartOutline,
  IoHeartSharp,
} from "react-icons/io5";

function removeManga(url: string) {
  // Verifica se a string contém "/manga"
  if (url.includes("/manga")) {
    // Remove "/manga" da string
    return url.replace("/manga", "");
  }
  // Retorna a string original se não contiver "/manga"
  return url;
}

function extractChapterNumber(chapterTitle: string): number {
  // Regex para encontrar números no título
  const matches = chapterTitle.match(/\d+(\.\d+)?/);

  if (matches && matches.length > 0) {
    // Converte o número encontrado para tipo number
    return parseFloat(matches[0]);
  }

  // Retorna 0 se não encontrar um número
  return 0;
}

export default function MangaPage() {
  const params = useParams();
  const mangaId =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : "";

  const { back } = useRouter();

  const [manga, setManga] = useState<Manga>({
    id: mangaId,
    title: "",
    description: "",
    img: "",
    chapters: 0,
    source: "",
    sourceUrl: "",
    url: "",
    isFavorite: true,
  });

  const [chapters, setChapters] = useState<Chapter[]>([]);

  const getChapters = async (url: string) => {
    const response = await fetchChaptersFromMangalivre(removeManga(url));

    if (!response) return;
    setChapters(response);

    console.log(response);
  };

  useEffect(() => {
    const getManga = async () => {
      if (!mangaId) return;

      const response = await getUniqueManga(mangaId);

      if (response) {
        setManga(response);

        getChapters(response.sourceUrl + response.url);
      } else {
        back();
      }
    };

    getManga();
  }, [mangaId, back]);

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col">
      {/* Fixed Top Section */}
      <div className="p-4 space-y-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <button
            className="text-white text-2xl cursor-pointer"
            onClick={() => window.history.back()}
          >
            <IoIosArrowDropleftCircle />
          </button>
          <div className="w-6" /> {/* Espaço para equilibrar layout */}
        </div>

        {/* Manga Info */}
        <div className="flex gap-4">
          <img
            src={manga.img || "/images/noimage.png"}
            alt={manga.title}
            width={100}
            height={150}
            className="rounded-lg object-cover"
          />

          <div className="flex flex-col justify-between flex-1">
            <h2 className="text-xl font-bold">{manga.title}</h2>
            <p className="text-sm text-gray-300 line-clamp-3">
              {manga.description}
            </p>

            <div className="flex gap-4 mt-2">
              <Button
                variant={"ghost"}
                className="text-red-500 text-xl"
                disabled={
                  manga.lastChapter
                    ? manga.chapters <= manga.lastChapter
                    : false
                }
              >
                {manga.isFavorite ? (
                  <IoHeartSharp size={35} />
                ) : (
                  <IoHeartOutline />
                )}
              </Button>
              <button className="text-white text-xl">
                <BsGlobe2
                  className="cursor-pointer"
                  onClick={() =>
                    window.open(manga.sourceUrl + manga.url, "_blank")
                  }
                />
              </button>
              <button className="text-white text-xl">
                <FiShare2 />
              </button>
            </div>
          </div>
        </div>

        <button className="bg-blue-600 text-white px-4 rounded-2xl w-full py-2 text-sm">
          Ler próximo capítulo
        </button>
      </div>

      {/* Scrollable Chapters Section */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="bg-neutral-800 p-4 rounded-t-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white font-semibold">Capítulos</span>
          </div>

          {/* Capítulos */}
          {chapters.map((chapter, index) => {
            const chapterNumber = extractChapterNumber(chapter.title);

            const readed = manga.lastChapter
              ? chapterNumber <= manga.lastChapter
              : false;

            return (
              <div
                className="flex items-center justify-between bg-neutral-700 p-3 rounded-xl"
                key={index}
              >
                <div>
                  <span className="text-sm font-medium">{chapter.title}</span>
                  <p className="text-xs text-gray-400">{chapter.date}</p>
                </div>

                {readed && (
                  <div className="flex items-center justify-center">
                    <IoCheckmarkSharp className="text-white text-2xl" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
