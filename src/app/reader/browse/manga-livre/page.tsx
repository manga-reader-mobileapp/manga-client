"use client";

import { getUniqueSource } from "@/api/sources/getUniqueSource";
import { fetchMangasMangaLivre } from "@/api/sources/manga-livre/fetchMangas";
import { searchMangasMangaLivre } from "@/api/sources/manga-livre/searchMangas";
import PopoverPage from "@/components/source/popover/page";
import { Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoIosArrowDropleftCircle } from "react-icons/io";

type Manga = {
  title: string;
  img: string;
  chapters: string;
  url: string;
  description: string;
};

export default function MangaLivrePage() {
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const isLoadingRef = useRef(false);
  const observerRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const [source, setSource] = useState<{ name: string; id: string }>({
    name: "",
    id: "",
  });

  const [showSearchInput, setShowSearchInput] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [query, setQuery] = useState("");

  const fetchMangas = useCallback(
    async (pageNum: number) => {
      if (isLoadingRef.current) return;

      const sourceData = await getUniqueSource("manga-livre");

      if (!sourceData) return;

      setSource(sourceData);

      setLoading(true);
      isLoadingRef.current = true;

      try {
        const res = await fetchMangasMangaLivre(pageNum, sourceData.url);
        if (res && Array.isArray(res)) {
          // Certifique-se de que ainda estamos no modo normal antes de atualizar os mangás
          // Isso evita que dados de diferentes modos se misturem
          if (!isSearchMode) {
            setMangas((prev) => (pageNum === 1 ? res : [...prev, ...res]));
          }
        }
      } catch (error) {
        console.error("Erro ao buscar mangas:", error);
      } finally {
        setLoading(false);
        isLoadingRef.current = false;
      }
    },
    [isSearchMode]
  );

  const searchMangas = useCallback(
    async (pageNum: number, searchQuery: string) => {
      if (isLoadingRef.current || !searchQuery) return;

      setLoading(true);
      isLoadingRef.current = true;

      try {
        const response = await searchMangasMangaLivre(searchQuery, pageNum);

        if (response && Array.isArray(response)) {
          // Se ainda estamos em modo de busca e com a mesma query, atualize os mangas
          setMangas((prev) => {
            // Se estamos na primeira página, substituímos completamente
            // Caso contrário, adicionamos à lista existente
            return pageNum === 1 ? response : [...prev, ...response];
          });
        }
      } catch (error) {
        console.error("Erro ao buscar mangas:", error);
      } finally {
        setLoading(false);
        isLoadingRef.current = false;
      }
    },
    []
  );

  // Handle search submission
  const handleSearch = useCallback(() => {
    if (query.trim() === "") {
      resetSearch();
      return;
    }

    // Primeiro atualizamos os estados relacionados à UI
    setIsSearchMode(true);

    // Limpamos os mangás e iniciamos a busca
    setMangas([]);
    setPage(1);

    // Pequeno timeout para garantir que a UI esteja completamente atualizada
    setTimeout(() => {
      searchMangas(1, query);
    }, 50);
  }, [query, searchMangas]);

  // Reset search and return to normal browsing
  const resetSearch = useCallback(() => {
    // Primeiro limpamos os dados
    setMangas([]);

    // Depois atualizamos os estados de UI
    setQuery("");
    setIsSearchMode(false);
    setShowSearchInput(false);
    setPage(1);

    // Pequeno timeout para garantir que a UI esteja completamente atualizada
    setTimeout(() => {
      fetchMangas(1);
    }, 50);
  }, [fetchMangas]);

  // Efeito para lidar com alterações de página (para ambos os modos)
  useEffect(() => {
    // Se estivermos no início, não queremos fazer nada, pois:
    // - No início do modo normal, temos o useEffect abaixo para carregar
    // - No início do modo de busca, já chamamos searchMangas a partir do handleSearch
    if (page === 1) return;

    // Se estivermos em modo de busca, busque mangas com a query atual
    if (isSearchMode && query.trim() !== "") {
      searchMangas(page, query);
    }
    // Se não estivermos em modo de busca, carregue mangas normalmente
    else if (!isSearchMode) {
      fetchMangas(page);
    }
  }, [page, isSearchMode, query, fetchMangas, searchMangas]);

  // Initial data load - apenas uma vez no carregamento inicial
  useEffect(() => {
    fetchMangas(1);
  }, [fetchMangas]);

  // Infinite scroll observer
  useEffect(() => {
    if (!observerRef.current) return;

    // Removemos qualquer observer anterior
    if (observer.current) {
      observer.current.disconnect();
    }

    // Criamos um novo observer
    observer.current = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isLoadingRef.current &&
          mangas.length > 0
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
  }, [mangas.length, loading]);

  return (
    <div className="flex flex-col h-screen gap-5 bg-neutral-900 text-white w-full">
      <div className="pt-4 px-5 flex items-center justify-between gap-2">
        {!showSearchInput ? (
          <>
            <h1 className="text-2xl">Manga Livre</h1>
            <button
              onClick={() => setShowSearchInput(true)}
              className="text-blue-500 hover:underline"
            >
              Buscar
            </button>
          </>
        ) : (
          <div className="w-full flex items-center gap-2">
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                } else if (e.key === "Escape") {
                  resetSearch();
                }
              }}
              placeholder="Digite o nome do mangá..."
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md"
            >
              <Search size={18} />
            </button>
            <button
              onClick={resetSearch}
              className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-md"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      {isSearchMode && query && (
        <div className="px-5">
          <p className="text-sm">
            Resultados para: <span className="font-bold">{query}</span>
            <button
              onClick={resetSearch}
              className="ml-2 text-blue-400 hover:underline"
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
            sourceId={source.id}
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
        ) : (
          <span className="text-white text-xs opacity-50">
            Role para carregar mais
          </span>
        )}
      </div>
    </div>
  );
}
