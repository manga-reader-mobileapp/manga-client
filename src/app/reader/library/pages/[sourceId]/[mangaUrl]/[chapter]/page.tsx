"use client";

import { getInfosPages } from "@/api/library/unique/getInfosPages";
import { updateLastRead } from "@/api/library/unique/updateLastRead";
import { fetchChaptersFromMangalivre } from "@/api/sources/manga-livre/fetchChapters";
import { fetchPagesFromMangalivre } from "@/api/sources/manga-livre/fetchPages";
import { extractChapterNumber } from "@/services/extractChapterNumber";
import { replaceDotsWithHyphens } from "@/services/replaceDotsWithHyphens";
import { Chapter, ObjectPages } from "@/type/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function MangaChapterViewer() {
  const { back, push } = useRouter();

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
    id: string;
  }>({
    chapters: 0,
    title: "",
    id: "",
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
    const { number: currentNumber } = extractChapterNumber(chapter);

    const chapterNumbers = chapters.map((ch) => {
      const { raw, number } = extractChapterNumber(ch.title);
      return {
        ...ch,
        rawNumber: raw,
        number, // para ordenação
      };
    });

    // Ordena por número (float), garantindo ordem crescente
    const sorted = chapterNumbers.sort((a, b) => a.number - b.number);

    const index = sorted.findIndex((ch) => ch.number === currentNumber);
    if (index === -1) return null;

    const nextIndex = direction === "next" ? index + 1 : index - 1;
    if (nextIndex < 0 || nextIndex >= sorted.length) return null;

    const nextChapter = sorted[nextIndex];

    // Se for da fonte "manga-livre", monta a URL customizada
    if (sourceId === "manga-livre") {
      return `/reader/library/pages/manga-livre/${mangaUrl}/${replaceDotsWithHyphens(
        nextChapter.rawNumber
      )}`;
    }

    // Senão, usa a URL padrão do capítulo
    return nextChapter.url;
  }

  // Nova função para verificar se é o primeiro ou último capítulo
  function isFirstOrLastChapter(): { isFirst: boolean; isLast: boolean } {
    if (!chapters.length) return { isFirst: false, isLast: false };

    const { number: currentNumber } = extractChapterNumber(chapter);

    const chapterNumbers = chapters.map((ch) => {
      const { number } = extractChapterNumber(ch.title);
      return number;
    });

    // Ordena por número (float), garantindo ordem crescente
    const sortedNumbers = [...chapterNumbers].sort((a, b) => a - b);

    // Verifica se é o primeiro (menor número) ou último (maior número)
    const isFirst = currentNumber === sortedNumbers[0];
    const isLast = currentNumber === sortedNumbers[sortedNumbers.length - 1];

    return { isFirst, isLast };
  }

  const { isFirst, isLast } = isFirstOrLastChapter();

  return (
    <div className="min-h-screen w-full bg-neutral-900 text-white flex flex-col">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen w-full bg-neutral-900">
          Carregando...
        </div>
      ) : (
        pages && (
          <div className="flex flex-col gap-4 px-4 sm:px-4 md:px-16 lg:px-72 xl:px-96 py-4 bg-neutral-900 pb-6">
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
              onClick={() => push(`/reader/library/read/${manga.id}`)}
              className="text-sm text-zinc-300 hover:text-white transition"
            >
              ⬅ Voltar
            </button>

            {/* Capítulo centralizado */}
            <div className="font-semibold text-base">Capítulo {chapter}</div>

            {/* Anterior / Próximo */}
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  const url = navigateChapter("prev");
                  if (url) {
                    push(url);

                    return;
                  }

                  toast.error("Erro ao buscar capitulo anterior");
                  push("reader/library");
                }}
                disabled={isFirst}
                className={`text-sm transition ${
                  isFirst
                    ? "text-zinc-500 cursor-not-allowed"
                    : "text-zinc-300 hover:text-white"
                }`}
              >
                ◀ Anterior
              </button>
              <button
                onClick={async () => {
                  await updateLastRead(manga.id, {
                    chapter: chapter,
                  });

                  if (isLast) {
                    push(`/reader/library/read/${manga.id}`);

                    return;
                  }

                  const url = navigateChapter("next");

                  if (url) {
                    push(url);

                    return;
                  }

                  toast.error("Erro ao buscar capitulo seguinte");
                  push("reader/library");
                }}
                className={`text-sm transition text-zinc-300 hover:text-white`}
              >
                {isLast ? "Ultimo Capitulo ▶" : "Próximo ▶"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
