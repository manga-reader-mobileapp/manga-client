"use client";

import { fetchMangasBrMangas } from "@/api/sources/br-mangas/fetchMangas";
import { getAllSources } from "@/api/sources/getAllSources";
import { fetchMangasMangaDex } from "@/api/sources/manga-dex/fetchMangas";
import { fetchMangasMangaLivre } from "@/api/sources/manga-livre/fetchMangas";
import { fetchMangasSeitaCelestial } from "@/api/sources/seita-celestial/fetchMangas";
import PopoverPage from "@/components/source/popover/page";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoIosArrowDropleftCircle } from "react-icons/io";

type Manga = {
  title: string;
  img: string;
  chapters: string;
  url: string;
  description: string;
  source?: string;
};

type Source = { name: string; id: string; url: string };

export default function MangaLivrePage() {
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const isLoadingRef = useRef(false);
  const observerRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [sources, setSources] = useState<{ name: string; id: string }[]>([]);
  const [activeSource, setActiveSource] = useState<string>("manga-livre");

  const [isSearchMode, setIsSearchMode] = useState(false);
  const [query, setQuery] = useState("");

  const sourcesDataRef = useRef<{
    mangaLivre: { name: string; id: string; url: string } | null;
    seitaCelestial: { name: string; id: string; url: string } | null;
    brMangas: { name: string; id: string; url: string } | null;
    mangaDex: { name: string; id: string; url: string } | null;
  }>({
    mangaLivre: null,
    seitaCelestial: null,
    brMangas: null,
    mangaDex: null,
  });

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const allSources = await getAllSources();

        setSources(allSources);

        sourcesDataRef.current = {
          mangaLivre: allSources.find((s: Source) => s.name === "manga-livre"),
          seitaCelestial: allSources.find(
            (s: Source) => s.name === "seita-celestial"
          ),
          brMangas: allSources.find((s: Source) => s.name === "br-mangas"),
          mangaDex: allSources.find((s: Source) => s.name === "manga-dex"),
        };

        fetchAllMangas(1);
      } catch (error) {
        console.error("Erro ao buscar fontes:", error);
      }
    };

    fetchSources();
  }, []);

  const fetchAllMangas = useCallback(
    async (pageNum: number) => {
      if (isLoadingRef.current || !hasMoreData) return;

      const {
        mangaLivre: mangaLivreSource,
        seitaCelestial: seitaCelestialSource,
        brMangas: brMangasSource,
        mangaDex: mangaDexSource,
      } = sourcesDataRef.current;

      if (!mangaLivreSource && !seitaCelestialSource) return;

      setLoading(true);
      isLoadingRef.current = true;

      try {
        let allMangas: Manga[] = [];

        if (activeSource === "manga-livre") {
          if (mangaLivreSource) {
            const mangaLivreResults = await fetchMangasMangaLivre(
              pageNum,
              mangaLivreSource.url
            );
            if (mangaLivreResults && Array.isArray(mangaLivreResults)) {
              const taggedResults = mangaLivreResults.map((manga) => ({
                ...manga,
                source: "manga-livre",
              }));
              allMangas = [...allMangas, ...taggedResults];
            }
          }
        }

        if (activeSource === "seita-celestial") {
          if (seitaCelestialSource) {
            const lerMangasResults = await fetchMangasSeitaCelestial(
              seitaCelestialSource.url,
              pageNum
            );
            if (lerMangasResults && Array.isArray(lerMangasResults)) {
              const taggedResults = lerMangasResults.map((manga) => ({
                ...manga,
                source: "seita-celestial",
              }));
              allMangas = [...allMangas, ...taggedResults];
            }
          }
        }

        if (activeSource === "br-mangas") {
          if (brMangasSource) {
            const brMangasResults = await fetchMangasBrMangas(
              pageNum,
              brMangasSource.url
            );
            if (brMangasResults && Array.isArray(brMangasResults)) {
              const taggedResults = brMangasResults.map((manga) => ({
                ...manga,
                source: "br-mangas",
              }));
              allMangas = [...allMangas, ...taggedResults];
            }
          }
        }

        if (activeSource === "manga-dex") {
          if (mangaDexSource) {
            const mangaDexResults = await fetchMangasMangaDex(
              pageNum,
              mangaDexSource.url
            );
            if (mangaDexResults && Array.isArray(mangaDexResults)) {
              const taggedResults = mangaDexResults.map((manga) => ({
                ...manga,
                source: "manga-dex",
              }));
              allMangas = [...allMangas, ...taggedResults];
            }
          }
        }

        if (allMangas.length === 0) {
          setHasMoreData(false);
        }

        if (!isSearchMode) {
          setMangas((prev) =>
            pageNum === 1 ? allMangas : [...prev, ...allMangas]
          );
        }
      } catch (error) {
        console.error("Erro ao buscar mangas:", error);
      } finally {
        setLoading(false);
        isLoadingRef.current = false;
      }
    },
    [isSearchMode, activeSource, hasMoreData]
  );

  const searchAllMangas = useCallback(
    async (pageNum: number, searchQuery: string) => {
      if (isLoadingRef.current || !searchQuery || !hasMoreData) return;

      setLoading(true);
      isLoadingRef.current = true;

      try {
      } catch (error) {
        console.error("Erro ao buscar mangas:", error);
      } finally {
        setLoading(false);
        isLoadingRef.current = false;
      }
    },
    [activeSource, hasMoreData]
  );

  const resetSearch = useCallback(() => {
    if (loading) return;
    setIsSearchMode(false);
    setQuery("");
    setPage(1);
  }, [loading]);

  const changeSource = useCallback(
    (source: string) => {
      if (loading || source === activeSource) return;

      setMangas([]);

      setActiveSource(source);
      setPage(1);
    },
    [loading, activeSource]
  );

  useEffect(() => {
    if (isLoadingRef.current) return;

    if (page === 1) {
      setHasMoreData(true);
      setMangas([]);
    }

    if (isSearchMode && query.trim() !== "") {
      searchAllMangas(page, query);
    } else {
      fetchAllMangas(page);
    }
  }, [page, activeSource, isSearchMode, fetchAllMangas, searchAllMangas]);

  // Removemos o useEffect que chamava fetchAllMangas(1), pois agora ele é chamado após buscar as fontes

  useEffect(() => {
    if (!observerRef.current) return;

    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isLoadingRef.current &&
          mangas.length > 0 &&
          hasMoreData
        ) {
          setPage((prev) => prev + 1);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    observer.current.observe(observerRef.current);

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [mangas.length, hasMoreData]);

  return (
    <div className="flex flex-col h-screen gap-5 bg-neutral-900 text-white w-full">
      <div className="pt-4 px-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl">Biblioteca de Mangás</h1>
        </div>

        {/* Seletor de fontes */}
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={() => changeSource("manga-livre")}
            className={`px-3 py-1 rounded-md text-sm ${
              activeSource === "manga-livre"
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            Manga Livre
          </button>
          <button
            onClick={() => changeSource("seita-celestial")}
            className={`px-3 py-1 rounded-md text-sm ${
              activeSource === "seita-celestial"
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            Seita Celestial
          </button>
          <button
            onClick={() => changeSource("br-mangas")}
            className={`px-3 py-1 rounded-md text-sm ${
              activeSource === "br-mangas"
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            Br Mangas
          </button>
          <button
            onClick={() => changeSource("manga-dex")}
            className={`px-3 py-1 rounded-md text-sm ${
              activeSource === "manga-dex"
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            MangaDex
          </button>
        </div>
      </div>

      {isSearchMode && query && (
        <div className="px-5">
          <p className="text-sm">
            Resultados para: <span className="font-bold">{query}</span>
            <button
              onClick={resetSearch}
              className={`ml-2 text-blue-400 hover:underline ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              Limpar busca
            </button>
          </p>
        </div>
      )}

      <div className="p-4 grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 bg-neutral-900">
        {mangas.map((manga, index) => (
          <PopoverPage
            url={manga.url}
            sourceId={
              sources.find((s) => {
                return s.name === activeSource;
              })?.id || ""
            }
            key={`manga-${index}`}
            title={manga.title || ""}
            img={manga.img || ""}
            chapters={manga.chapters || ""}
            description={manga.description || ""}
          />
        ))}
      </div>

      <button
        className="fixed bottom-4 left-4 z-50 bg-white cursor-pointer text-black px-2 py-2 rounded-2xl shadow-lg transition-colors duration-200 hover:bg-white/80"
        onClick={() => window.history.back()}
      >
        <IoIosArrowDropleftCircle size={24} />
      </button>

      {/* Observer para scroll infinito */}
      <div
        ref={observerRef}
        className="h-20 col-span-full flex justify-center items-center mt-4 mb-4 bg-neutral-900"
      >
        {loading ? (
          <span className="text-white text-sm">Carregando...</span>
        ) : hasMoreData ? (
          <span className="text-white text-xs opacity-50">
            Role para carregar mais
          </span>
        ) : (
          <span className="text-white text-xs opacity-50">
            Não há mais itens para carregar
          </span>
        )}
      </div>
    </div>
  );
}
