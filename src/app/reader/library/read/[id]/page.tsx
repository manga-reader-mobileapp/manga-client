"use client";

import { getUniqueManga } from "@/api/library/unique/getUniqueManga";
import { favoriteSavedManga } from "@/api/sources/geral/favoriteSavedManga";
import { unfavoriteManga } from "@/api/sources/geral/unfavoriteManga";
import { fetchChaptersFromMangalivre } from "@/api/sources/manga-livre/fetchChapters";
import { Button } from "@/components/ui/button";
import { extractChapterNumber } from "@/services/extractChapterNumber";
import { replaceDotsWithHyphens } from "@/services/replaceDotsWithHyphens";
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
import { toast } from "sonner";

export default function MangaPage() {
  const params = useParams();
  const mangaId =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : "";

  const { back, push } = useRouter();

  const [manga, setManga] = useState<Manga>({
    id: mangaId,
    title: "",
    description: "",
    img: "",
    chapters: "0",
    source: "",
    sourceUrl: "",
    url: "",
    isFavorite: true,
  });

  const [chapters, setChapters] = useState<Chapter[]>([]);

  const [lastChapter, setLastChapter] = useState<{
    number: number;
    raw: string;
  } | null>(null);

  const [firstChapter, setFirstChapter] = useState<{
    number: number;
    raw: string;
  } | null>(null);

  const getChapters = async (url: string) => {
    if (!manga.url) return;
    const response = await fetchChaptersFromMangalivre(url, manga.url);

    if (!response) return;
    setChapters(response);

    setFirstChapter(extractChapterNumber(response[response.length - 1].title));

    setLastChapter(extractChapterNumber(response[0].title));
  };

  useEffect(() => {
    const getManga = async () => {
      if (!mangaId) return;

      const response = await getUniqueManga(mangaId);

      if (response) {
        setManga(response);

        getChapters(response.sourceUrl);
      } else {
        back();
      }
    };

    getManga();
  }, [mangaId, back, manga.url]);

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col w-full">
      {/* Fixed Top Section */}
      <div className="p-4 space-y-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <button
            className="text-white text-2xl cursor-pointer"
            onClick={() => push(`/reader/library`)}
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
              {manga.isFavorite ? (
                <IoHeartSharp
                  className="text-red-500 text-2xl cursor-pointer"
                  onClick={async () => {
                    if (!manga.url) return;

                    const response = await unfavoriteManga(
                      { url: manga.url },
                      manga.source
                    );

                    if (response) {
                      setManga((prev) => {
                        return {
                          ...prev,
                          isFavorite: false,
                        };
                      });
                      return;
                    }

                    toast.error("Erro ao desfavoritar manga");
                  }}
                />
              ) : (
                <IoHeartOutline
                  className="text-red-500 text-2xl cursor-pointer"
                  onClick={async () => {
                    const response = await favoriteSavedManga(mangaId);

                    if (response) {
                      setManga((prev) => {
                        return {
                          ...prev,
                          isFavorite: true,
                        };
                      });

                      return;
                    }
                    toast.error("Erro ao favoritar manga");
                  }}
                />
              )}
              <button className="text-white text-xl">
                <BsGlobe2
                  className="cursor-pointer"
                  onClick={() => {
                    if (manga.sourceName === "manga-livre") {
                      window.open(
                        manga.sourceUrl + "/manga/" + manga.url,
                        "_blank"
                      );
                    }
                  }}
                />
              </button>
              <button className="text-white text-xl">
                <FiShare2 />
              </button>
            </div>
          </div>
        </div>

        {!!lastChapter?.raw && !!firstChapter?.raw ? (
          lastChapter.raw === manga.lastChapter ? (
            <Button
              disabled
              variant="default"
              className=" text-white px-4 rounded-2xl w-full py-2 text-sm"
            >
              Sem próximo capitulo
            </Button>
          ) : (
            <button
              className="bg-blue-600 text-white px-4 rounded-2xl w-full py-2 text-sm cursor-pointer hover:bg-blue-500"
              onClick={() => {
                // Se não leu nenhum capítulo ainda
                if (!manga.lastChapter) {
                  push(
                    `/reader/library/pages/${manga.sourceName}/${
                      manga.url
                    }/${replaceDotsWithHyphens(firstChapter.raw)}`
                  );
                  return;
                }

                // Já leu algum capítulo
                const currentIndex = chapters.findIndex(
                  (ch) =>
                    extractChapterNumber(ch.title).raw === manga.lastChapter
                );

                // Se o capítulo atual não está na lista, fallback para o primeiro
                if (currentIndex === -1) {
                  push(
                    `/reader/library/pages/${manga.sourceName}/${
                      manga.url
                    }/${replaceDotsWithHyphens(firstChapter.raw)}`
                  );
                  return;
                }

                // Pegar o próximo capítulo, se existir
                const next = extractChapterNumber(
                  chapters[currentIndex - 1].title
                ).raw;

                if (next) {
                  push(
                    `/reader/library/pages/${manga.sourceName}/${
                      manga.url
                    }/${replaceDotsWithHyphens(next)}`
                  );
                } else {
                  alert("Você já está no último capítulo.");
                }
              }}
            >
              Ler próximo capítulo
            </button>
          )
        ) : (
          <Button
            disabled
            variant="default"
            className=" text-white px-4 rounded-2xl w-full py-2 text-sm"
          >
            Carregando...
          </Button>
        )}
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
              ? Number(chapterNumber.number) <= Number(manga.lastChapter)
              : false;

            return (
              <div
                className="flex items-center justify-between bg-neutral-700 p-3 rounded-xl cursor-pointer hover:bg-neutral-600"
                key={index}
                onClick={() => {
                  push(
                    `/reader/library/pages/${manga.sourceName}/${
                      manga.url
                    }/${replaceDotsWithHyphens(chapterNumber.raw)}`
                  );
                }}
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
