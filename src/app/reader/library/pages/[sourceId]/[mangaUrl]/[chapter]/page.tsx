"use client";

import { getInfosPages } from "@/api/library/unique/getInfosPages";
import { updateLastRead } from "@/api/library/unique/updateLastRead";
import { fetchChaptersFromBrMangas } from "@/api/sources/br-mangas/fetchChapters";
import { fetchPagesFromBrMangas } from "@/api/sources/br-mangas/fetchPages";
import { fetchChaptersFromMangalivre } from "@/api/sources/manga-livre/fetchChapters";
import { fetchPagesFromMangalivre } from "@/api/sources/manga-livre/fetchPages";
import { fetchChaptersFromSeitaCelestial } from "@/api/sources/seita-celestial/fetchChapters.";
import { fetchPagesFromSeitaCelestial } from "@/api/sources/seita-celestial/fetchPages";
import { extractChapterNumber } from "@/services/extractChapterNumber";
import { Chapter, ObjectPages } from "@/type/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function MangaChapterViewer() {
  const { back, push } = useRouter();

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
  // Estado para rastrear a página atual que o usuário está visualizando
  const [currentPage, setCurrentPage] = useState(1);

  // Refs para cada página
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Ref para o elemento de conteúdo principal para detectar scroll
  const contentRef = useRef<HTMLDivElement | null>(null);

  // Função para forçar verificação de páginas visíveis
  const checkVisiblePagesRef = useRef<() => void>(() => {});

  const [manga, setManga] = useState<{
    chapters: number;
    title: string;
    id: string;
  }>({
    chapters: 0,
    title: "",
    id: "",
  });
  // Substituição da função redirectPage atual

  const redirectPage = async () => {
    const getReadingProgress = localStorage.getItem("manga-reading-progress");

    if (getReadingProgress) {
      try {
        const progress = JSON.parse(getReadingProgress);

        if (Array.isArray(progress)) {
          const thisManga = progress.find(
            (p) =>
              p.sourceId === sourceId &&
              p.mangaUrl === mangaUrl &&
              p.chapter === chapter
          );

          if (thisManga && thisManga.pageNumber) {
            // Usar o número da página salvo em vez de um valor fixo
            setCurrentPage(thisManga.pageNumber);

            // Dar tempo para que as imagens carreguem
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Rolar para a página salva
            const targetElement = document.getElementById(
              `manga-page-${thisManga.pageNumber}`
            );
            if (targetElement) {
              targetElement.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
          }
        }
      } catch (error) {
        console.error("Erro ao processar progresso de leitura:", error);
      }
    }
  };

  const onPageChange = (oldPage: number, newPage: number) => {
    saveReadingProgress(newPage);
  };

  const saveReadingProgress = (pageNumber: number) => {
    const readingProgressKey = "manga-reading-progress";
    let progress = [];

    const existingProgress = localStorage.getItem(readingProgressKey);
    if (existingProgress) {
      try {
        progress = JSON.parse(existingProgress);
      } catch (error) {
        console.error("Erro ao recuperar progresso de leitura:", error);
      }
    }

    if (!Array.isArray(progress)) {
      progress = [];
    }

    const mangaIndex = progress.findIndex(
      (p) => p.sourceId === sourceId && p.mangaUrl === mangaUrl
    );

    if (mangaIndex >= 0) {
      // Atualiza obra existente
      progress[mangaIndex] = {
        ...progress[mangaIndex],
        chapter,
        pageNumber,
      };
    } else {
      progress.push({
        sourceId,
        mangaUrl,
        chapter,
        pageNumber,
      });

      const uniqueWorks = new Map();
      for (let i = 0; i < progress.length; i++) {
        const key = `${progress[i].sourceId}-${progress[i].mangaUrl}`;
        uniqueWorks.set(key, progress[i]);
      }

      progress = Array.from(uniqueWorks.values()).slice(-10);
    }

    localStorage.setItem(readingProgressKey, JSON.stringify(progress));
  };

  const getChapters = async (url: string) => {
    if (!mangaUrl) return;

    if (sourceId === "manga-livre") {
      const response = await fetchChaptersFromMangalivre(url, mangaUrl);

      if (!response) return;
      setChapters(response);
    }

    if (sourceId === "seita-celestial") {
      const response = await fetchChaptersFromSeitaCelestial(
        url + "/comics/" + mangaUrl
      );

      if (!response) return;
      setChapters(response);
    }

    if (sourceId === "br-mangas") {
      const response = await fetchChaptersFromBrMangas(url, mangaUrl);

      if (!response) return;
      setChapters(response);
    }
  };

  useEffect(() => {
    const fetchPages = async () => {
      if (!sourceId || !mangaUrl || !chapter) return;

      setIsLoading(true);

      const source = await getInfosPages(sourceId, mangaUrl);

      if (sourceId === "manga-livre") {
        if (!source) {
          back();

          return;
        }

        setManga(source);

        const response = await fetchPagesFromMangalivre(
          `${source.url}/manga/${mangaUrl}/${chapter}`
        );

        if (response) {
          setPages(response);

          setIsLoading(false);

          redirectPage();

          getChapters(source.url);

          return;
        }
        back();
      }

      if (sourceId === "seita-celestial") {
        const response = await fetchPagesFromSeitaCelestial(
          `${source.url}/${mangaUrl}-chapter-${chapter}`
        );

        if (response) {
          setPages(response);

          setIsLoading(false);

          getChapters(source.url);

          return;
        }
      }
      if (sourceId === "br-mangas") {
        const response = await fetchPagesFromBrMangas(
          `${source.url}/manga/${mangaUrl}/${chapter}`
        );

        if (response) {
          setPages(response);

          setIsLoading(false);

          getChapters(source.url);

          return;
        }
      }
      // back();
    };

    fetchPages();
  }, [sourceId, mangaUrl, chapter, back]);

  // Configurar o rastreamento de páginas visíveis
  useEffect(() => {
    if (isLoading || !pages.images.length) return;

    pageRefs.current = pageRefs.current.slice(0, pages.images.length);

    interface PageVisibilityInfo {
      index: number;
      visibility: number;
      visibleArea?: number;
      score?: number;
      distanceFromCenter?: number;
    }

    const checkVisiblePages = () => {
      const pageVisibility: PageVisibilityInfo[] = pageRefs.current.map(
        (ref, index) => {
          if (!ref) return { index, visibility: 0 };

          const rect = ref.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          const visibleTop = Math.max(0, rect.top);
          const visibleBottom = Math.min(windowHeight, rect.bottom);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);

          const visibility = visibleHeight / rect.height;
          const visibleArea = visibleHeight * rect.width;

          const centerY = windowHeight / 2;
          const distanceFromCenter = Math.abs(
            rect.top + rect.height / 2 - centerY
          );
          const centerFactor = 1 - distanceFromCenter / (windowHeight / 2);

          const score = visibility * 0.7 + Math.max(0, centerFactor) * 0.3;

          return {
            index,
            visibility,
            visibleArea,
            score,
            distanceFromCenter,
          };
        }
      );

      const bestScore = pageVisibility.reduce<PageVisibilityInfo>(
        (prev, current) =>
          (current.score || 0) > (prev.score || 0) ? current : prev,
        { index: 0, visibility: 0, score: 0 }
      );

      const largestVisibleArea = pageVisibility.reduce<PageVisibilityInfo>(
        (prev, current) =>
          (current.visibleArea || 0) > (prev.visibleArea || 0) ? current : prev,
        { index: 0, visibility: 0, visibleArea: 0 }
      );

      const centeredPages = pageVisibility
        .filter((p) => p.visibility > 0.15)
        .sort((a, b) => {
          const distA = a.distanceFromCenter || Infinity;
          const distB = b.distanceFromCenter || Infinity;
          return distA - distB;
        });

      let winningPage;
      if (centeredPages.length > 0) {
        winningPage = centeredPages[0];
      } else if ((bestScore.score || 0) > 0.1) {
        winningPage = bestScore;
      } else if ((largestVisibleArea.visibleArea || 0) > 0) {
        winningPage = largestVisibleArea;
      }

      if (winningPage && winningPage.index !== undefined) {
        const newPage = winningPage.index + 1;
        if (newPage !== currentPage) {
          const oldPage = currentPage;
          setCurrentPage(newPage);
          onPageChange(oldPage, newPage);
        }
      }
    };

    checkVisiblePagesRef.current = checkVisiblePages;

    const imageLoadHandler = () => {
      setTimeout(checkVisiblePages, 100);
    };

    window.addEventListener("scroll", checkVisiblePages, { passive: true });
    window.addEventListener("resize", checkVisiblePages, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          checkVisiblePages();
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    // Observar todas as páginas
    pageRefs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref);

        const img = ref.querySelector("img");
        if (img) {
          if (img.complete) {
            imageLoadHandler();
          } else {
            img.addEventListener("load", imageLoadHandler, { once: true });
          }
        }
      }
    });

    setTimeout(checkVisiblePages, 500);

    return () => {
      window.removeEventListener("scroll", checkVisiblePages);
      window.removeEventListener("resize", checkVisiblePages);

      pageRefs.current.forEach((ref) => {
        if (ref) {
          observer.unobserve(ref);

          const img = ref.querySelector("img");
          if (img) {
            img.removeEventListener("load", imageLoadHandler);
          }
        }
      });
    };
  }, [isLoading, pages.images, currentPage]);

  function navigateChapter(direction: "next" | "prev"): Chapter | null {
    const { number: currentNumber } = extractChapterNumber(chapter);

    const chapterNumbers = chapters.map((ch) => {
      const { raw, number } = extractChapterNumber(ch.title);
      return {
        ...ch,
        rawNumber: raw,
        number,
      };
    });

    const sorted = chapterNumbers.sort((a, b) => a.number - b.number);

    const index = sorted.findIndex((ch) => ch.number === currentNumber);
    if (index === -1) return null;

    const nextIndex = direction === "next" ? index + 1 : index - 1;
    if (nextIndex < 0 || nextIndex >= sorted.length) return null;

    const nextChapter = sorted[nextIndex];

    return nextChapter;
  }

  function isFirstOrLastChapter(): { isFirst: boolean; isLast: boolean } {
    if (!chapters.length) return { isFirst: false, isLast: false };

    const { number: currentNumber } = extractChapterNumber(chapter);

    const chapterNumbers = chapters.map((ch) => {
      const { number } = extractChapterNumber(ch.title);
      return number;
    });

    const sortedNumbers = [...chapterNumbers].sort((a, b) => a - b);

    const isFirst = currentNumber === sortedNumbers[0];
    const isLast = currentNumber === sortedNumbers[sortedNumbers.length - 1];

    return { isFirst, isLast };
  }

  const handlePushChapter = (chapterNumber: Chapter) => {
    push(
      `/reader/library/pages/${sourceId}/${mangaUrl}/${chapterNumber.chapterSlug}`
    );
  };

  const { isFirst, isLast } = isFirstOrLastChapter();

  const CheckVisibleButton = () => (
    <button
      className="hidden"
      data-check-visible="true"
      onClick={() => checkVisiblePagesRef.current()}
    />
  );

  return (
    <div className="min-h-screen w-full bg-neutral-900 text-white flex flex-col">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen w-full bg-neutral-900">
          Carregando...
        </div>
      ) : (
        pages && (
          <div
            className="flex flex-col gap-4 px-4 sm:px-4 md:px-16 lg:px-72 xl:px-96 py-4 bg-neutral-900 pb-20"
            ref={contentRef}
          >
            <CheckVisibleButton />
            {pages.images.map((page, index) => (
              <div
                className="flex items-center justify-center bg-neutral-700 p-3 rounded-xl relative"
                key={index}
                ref={(el) => {
                  pageRefs.current[index] = el;
                }}
                id={`manga-page-${index + 1}`}
                data-page-number={index + 1}
              >
                {/* Número da página no canto */}
                <div className="absolute top-5 left-5 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-sm">
                  {index + 1}/{pages.images.length}
                </div>

                {sourceId === "br-mangas" ? (
                  <img
                    loading="lazy"
                    src={`/api/proxy?url=${page.imageUrl}`}
                    alt={`Página ${index + 1} do mangá`}
                    onLoad={() => {
                      if (index === 0) {
                        const checkVisibleButton =
                          pageRefs.current[0]?.parentElement?.querySelector(
                            "[data-check-visible=true]"
                          ) as HTMLButtonElement | null;

                        if (checkVisibleButton) {
                          checkVisibleButton.click();
                        }
                      }
                    }}
                  />
                ) : (
                  <img
                    loading="lazy"
                    src={page.imageUrl}
                    alt={`Página ${index + 1} do mangá`}
                    className="w-full h-full object-cover"
                    onLoad={() => {
                      if (index === 0) {
                        const checkVisibleButton =
                          pageRefs.current[0]?.parentElement?.querySelector(
                            "[data-check-visible=true]"
                          ) as HTMLButtonElement | null;

                        if (checkVisibleButton) {
                          checkVisibleButton.click();
                        }
                      }
                    }}
                  />
                )}
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
              onClick={() => {
                if (!manga.id) {
                  push(`/reader/library`);
                  return;
                }

                push(`/reader/library/read/${manga.id}`);
              }}
              className="text-sm text-zinc-300 hover:text-white transition"
            >
              ⬅ Voltar
            </button>

            {/* Capítulo e Página */}
            <div className="flex flex-col items-center">
              <div className="font-semibold text-sm">
                Capítulo {extractChapterNumber(chapter).raw}
              </div>
              <div className="text-xs text-zinc-300">
                Página {currentPage} de {pages.images.length}
              </div>
            </div>

            {/* Anterior / Próximo */}
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  const url = navigateChapter("prev");
                  if (url) {
                    handlePushChapter(url);

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
                    chapter: extractChapterNumber(chapter).raw,
                  });

                  if (isLast) {
                    push(`/reader/library/read/${manga.id}`);

                    return;
                  }

                  const url = navigateChapter("next");

                  if (url) {
                    handlePushChapter(url);

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
