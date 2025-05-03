"use client";

import { getInfosPages } from "@/api/library/unique/getInfosPages";
import { fetchChaptersFromMangalivre } from "@/api/sources/manga-livre/fetchChapters";
import { fetchPagesFromMangalivre } from "@/api/sources/manga-livre/fetchPages";
import { replaceDotsWithHyphens } from "@/services/replaceDotsWithHyphens";
import { Chapter, ObjectPages } from "@/type/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function extractChapterNumber(title: string): number {
  const match = title.match(/(\d+(\.\d+)?)/); // Captura 30 ou 30.5
  return match ? parseFloat(match[0]) : 0;
}

export default function MangaChapterViewer() {
  const { back } = useRouter();

  // Obter os parâmetros da URL
  const params = useParams();

  const [isLoading, setIsLoading] = useState(true);

  const sourceId = params["sourceId"] as string;
  const mangaUrl = params["mangaUrl"] as string;
  const chapter = params["chapter"] as string;

  const [pages, setPages] = useState<ObjectPages>({
    totalPages: 0,
    images: [],
  });
  const [chapters, setChapters] = useState<Chapter[]>([]);

  const [manga, setManga] = useState<{
    chapters: number;
    title: string;
  }>({
    chapters: 0,
    title: "",
  });

  const getChapters = async (url: string) => {
    if (!mangaUrl) return;
    const response = await fetchChaptersFromMangalivre(url, mangaUrl);

    if (!response) return;
    setChapters(response);
  };

  useEffect(() => {
    const fetchPages = async () => {
      if (!sourceId || !mangaUrl || !chapter) return;

      setIsLoading(true);

      if (sourceId === "manga-livre") {
        const source = await getInfosPages(sourceId, mangaUrl);

        if (!source) {
          back();

          return;
        }

        setManga(source);

        const response = await fetchPagesFromMangalivre(
          `${source.url}/manga/${mangaUrl}/capitulo-${replaceDotsWithHyphens(
            chapter
          )}/`
        );

        if (response) {
          setPages(response);

          setIsLoading(false);

          getChapters(source.url);

          return;
        }
        back();
      }
    };

    fetchPages();
  }, [sourceId, mangaUrl, chapter]);

  function navigateChapter(direction: "next" | "prev"): string | null {
    const currentNumber = extractChapterNumber(chapter);

    const chapterNumbers = chapters.map((ch) => ({
      ...ch,
      number: extractChapterNumber(ch.title),
    }));

    // Ordenar para garantir sequência
    const sorted = chapterNumbers.sort((a, b) => a.number - b.number);

    const index = sorted.findIndex((ch) => ch.number === currentNumber);

    if (index === -1) return null;

    const nextIndex = direction === "next" ? index + 1 : index - 1;

    if (nextIndex < 0 || nextIndex >= sorted.length) return null;

    console.log(sorted[nextIndex].url);

    return sorted[nextIndex].url; // URL do próximo ou anterior
  }

  return (
    <div className="min-h-screen w-full bg-neutral-900 text-white flex flex-col">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen w-full">
          Carregando...
        </div>
      ) : (
        pages && (
          <div className="flex flex-col gap-4 px-5 py-4 bg-neutral-900 pb-6">
            {pages.images.map((page, index) => (
              <div
                className="flex items-center justify-center bg-neutral-700 p-3 rounded-xl "
                key={index}
              >
                <img
                  src={page.imageUrl}
                  alt="img"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )
      )}

      {!!chapters[0] && (
        <div className="fixed bottom-0 w-full bg-zinc-800 text-white px-4 py-2 z-50">
          <div className="flex items-center justify-between">
            {/* Voltar */}
            <button
              onClick={() => back()}
              className="text-sm text-zinc-300 hover:text-white transition"
            >
              ⬅ Voltar
            </button>

            {/* Capítulo centralizado */}
            <div className="absolute left-1/2 transform -translate-x-1/2 font-semibold text-base">
              Capítulo {chapter}
            </div>

            {/* Anterior / Próximo */}
            <div className="flex space-x-4">
              <button
                // onClick={}
                className="text-sm text-zinc-300 hover:text-white transition"
              >
                ◀ Anterior
              </button>
              <button
                // onClick={onNext}
                className="text-sm text-zinc-300 hover:text-white transition"
              >
                Próximo ▶
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
