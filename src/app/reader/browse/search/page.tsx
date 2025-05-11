"use client";

import { getAllSources } from "@/api/sources/getAllSources";
import { searchMangasMangaDex } from "@/api/sources/manga-dex/searchMangas";
import { searchMangasMangaLivre } from "@/api/sources/manga-livre/searchMangas";
import { searchMangasSeitaCelestial } from "@/api/sources/seita-celestial/searchMangas";
import Popup from "@/components/popup/page";
import PopoverPage from "@/components/source/popover/page";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { IoClose } from "react-icons/io5";

interface Manga {
  title: string;
  img: string;
  chapters: string;
  url: string;
  description: string;
}

interface SearchResultsState {
  mangaLivre: {
    data: Manga[];
    loading: boolean;
    error: string | null;
    page: number;
    hasMore: boolean;
  };
  seitaCelestial: {
    data: Manga[];
    loading: boolean;
    error: string | null;
    page: number;
    hasMore: boolean;
  };
  mangaDex: {
    data: Manga[];
    loading: boolean;
    error: string | null;
    page: number;
    hasMore: boolean;
  };
}

export default function MangaSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activePopup, setActivePopup] = useState<string | null>(null);

  const { push } = useRouter();

  const [sources, setSources] = useState<
    { name: string; id: string; url: string }[]
  >([]);

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const allSources = await getAllSources();

        setSources(allSources);
      } catch (error) {
        console.error("Erro ao buscar fontes:", error);
      }
    };

    fetchSources();
  }, []);

  const [results, setResults] = useState<SearchResultsState>({
    mangaLivre: {
      data: [],
      loading: false,
      error: null,
      page: 1,
      hasMore: true,
    },
    seitaCelestial: {
      data: [],
      loading: false,
      error: null,
      page: 1,
      hasMore: true,
    },
    mangaDex: {
      data: [],
      loading: false,
      error: null,
      page: 1,
      hasMore: true,
    },
  });

  const searchMangas = async (term: string) => {
    if (!term.trim()) return;

    setResults({
      mangaLivre: {
        data: [],
        loading: true,
        error: null,
        page: 1,
        hasMore: true,
      },
      seitaCelestial: {
        data: [],
        loading: true,
        error: null,
        page: 1,
        hasMore: true,
      },
      mangaDex: {
        data: [],
        loading: true,
        error: null,
        page: 1,
        hasMore: true,
      },
    });

    try {
      // Buscar do Manga Livre
      let mangaLivreResults = await searchMangasMangaLivre(
        sources.find((t) => t.name === "manga-livre")?.url || "",
        term,
        1
      );
      // Adicionar a fonte aos resultados
      if (mangaLivreResults) {
        mangaLivreResults = mangaLivreResults.map((manga) => ({
          ...manga,
          source: "Manga Livre",
        }));
      }

      // Buscar da Seita Celestial
      let seitaCelestialResults = await searchMangasSeitaCelestial(
        sources.find((t) => t.name === "seita-celestial")?.url || "",
        term,
        1
      );

      // Adicionar a fonte aos resultados
      if (seitaCelestialResults) {
        seitaCelestialResults = seitaCelestialResults.map((manga) => ({
          ...manga,
          source: "Seita Celestial",
        }));
      }

      // Buscar do MangaDex
      let mangaDexResults = await searchMangasMangaDex(
        sources.find((t) => t.name === "manga-dex")?.url || "",
        term,
        1
      );

      // Adicionar a fonte aos resultados
      if (mangaDexResults) {
        mangaDexResults = mangaDexResults.map((manga) => ({
          ...manga,
          source: "MangaDex",
        }));
      }

      setResults({
        mangaLivre: {
          data: mangaLivreResults || [],
          loading: false,
          error:
            mangaLivreResults === null ? "Erro ao buscar do Manga Livre" : null,
          page: 1,
          hasMore: !!(mangaLivreResults && mangaLivreResults.length > 0),
        },
        seitaCelestial: {
          data: seitaCelestialResults || [],
          loading: false,
          error:
            seitaCelestialResults === null
              ? "Erro ao buscar da Seita Celestial"
              : null,
          page: 1,
          hasMore: !!(
            seitaCelestialResults && seitaCelestialResults.length > 0
          ),
        },
        mangaDex: {
          data: mangaDexResults || [],
          loading: false,
          error: mangaDexResults === null ? "Erro ao buscar do MangaDex" : null,
          page: 1,
          hasMore: !!(mangaDexResults && mangaDexResults.length > 0),
        },
      });
    } catch (error) {
      console.error("Erro na busca:", error);
    }
  };

  const loadMore = async (
    source: "mangaLivre" | "seitaCelestial" | "mangaDex"
  ) => {
    if (
      !searchTerm.trim() ||
      !results[source].hasMore ||
      results[source].loading
    )
      return;

    // Atualizar estado para indicar carregamento
    setResults((prev) => ({
      ...prev,
      [source]: {
        ...prev[source],
        loading: true,
      },
    }));

    const nextPage = results[source].page + 1;
    let newResults:
      | {
          title: string;
          img: string;
          chapters: string;
          url: string;
          description: string;
        }[]
      | null = null;

    try {
      // Determinar qual função de busca usar com base na fonte
      switch (source) {
        case "mangaLivre":
          newResults = await searchMangasMangaLivre(
            sources.find((t) => t.name === "manga-livre")?.url || "", // ajuste com a URL correta
            searchTerm,
            nextPage
          );
          // Adicionar a fonte aos resultados
          if (newResults) {
            newResults = newResults.map((manga) => ({
              ...manga,
              source: "Manga Livre",
            }));
          }
          break;
        case "seitaCelestial":
          newResults = await searchMangasSeitaCelestial(
            sources.find((t) => t.name === "seita-celestial")?.url || "", // ajuste com a URL correta
            searchTerm,
            nextPage
          );
          // Adicionar a fonte aos resultados
          if (newResults) {
            newResults = newResults.map((manga) => ({
              ...manga,
              source: "Seita Celestial",
            }));
          }
          break;
        case "mangaDex":
          newResults = await searchMangasMangaDex(
            sources.find((t) => t.name === "manga-dex")?.url || "",
            searchTerm,
            nextPage
          );
          // Adicionar a fonte aos resultados
          if (newResults) {
            newResults = newResults.map((manga) => ({
              ...manga,
              source: "MangaDex",
            }));
          }
          break;
      }

      // Atualizar resultados com os novos dados
      setResults((prev) => ({
        ...prev,
        [source]: {
          data: newResults
            ? [...prev[source].data, ...newResults]
            : prev[source].data,
          loading: false,
          error:
            newResults === null
              ? `Erro ao carregar mais mangás de ${source}`
              : null,
          page:
            newResults && newResults.length > 0 ? nextPage : prev[source].page,
          hasMore: newResults && newResults.length > 0,
        },
      }));
    } catch (error) {
      console.error(`Erro ao carregar mais mangás de ${source}:`, error);
      setResults((prev) => ({
        ...prev,
        [source]: {
          ...prev[source],
          loading: false,
          error: `Erro ao carregar mais mangás de ${source}`,
        },
      }));
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchTerm("");
    setResults({
      mangaLivre: {
        data: [],
        loading: false,
        error: null,
        page: 1,
        hasMore: true,
      },
      seitaCelestial: {
        data: [],
        loading: false,
        error: null,
        page: 1,
        hasMore: true,
      },
      mangaDex: {
        data: [],
        loading: false,
        error: null,
        page: 1,
        hasMore: true,
      },
    });
  };

  const renderSourceSection = (
    title: string,
    source: "manga-livre" | "seita-celestial" | "manga-dex",
    data: Manga[],
    loading: boolean,
    error: string | null,
    hasMore: boolean
  ) => (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        {data.length > 0 && (
          <button
            className="text-blue-600 hover:text-blue-800"
            onClick={() => setActivePopup(source)}
          >
            Ver mais
          </button>
        )}
      </div>

      {loading && <p className="text-center py-4">Carregando...</p>}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && data.length === 0 && searchTerm && (
        <p className="text-center py-4">
          Nenhum mangá encontrado para &quot;{searchTerm}&ldquo;
        </p>
      )}

      {data.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {data.slice(0, 3).map((manga, index) => (
            <PopoverPage
              url={manga.url}
              sourceId={sources.find((s) => s.name === source)?.id || ""}
              key={`manga-${index}`}
              title={manga.title || ""}
              img={manga.img || ""}
              chapters={manga.chapters || ""}
              description={manga.description || ""}
            />
          ))}
        </div>
      )}

      <Popup
        isOpen={activePopup === source}
        onClose={() => setActivePopup(null)}
      >
        <div className="w-full max-w-4xl">
          <div className="w-full flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              {title} - Resultados para &quot;{searchTerm}&ldquo;
            </h2>

            <div>
              <IoClose
                size={24}
                onClick={() => setActivePopup(null)}
                className="cursor-pointer"
              />
            </div>
          </div>

          {data.length > 0 ? (
            <>
              <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                {data.map((manga, index) => (
                  <PopoverPage
                    url={manga.url}
                    sourceId={sources.find((s) => s.name === source)?.id || ""}
                    key={`manga-${index}`}
                    title={manga.title || ""}
                    img={manga.img || ""}
                    chapters={manga.chapters || ""}
                    description={manga.description || ""}
                  />
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center mt-4 mb-2">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() =>
                      loadMore(
                        source === "manga-livre"
                          ? "mangaLivre"
                          : source === "seita-celestial"
                          ? "seitaCelestial"
                          : "mangaDex"
                      )
                    }
                    disabled={loading}
                  >
                    {loading ? "Carregando..." : "Carregar mais"}
                  </button>
                </div>
              )}

              {!hasMore && (
                <p className="text-center text-gray-600">
                  Não há mais resultados para exibir.
                </p>
              )}
            </>
          ) : (
            <p className="text-center py-4">Nenhum mangá encontrado.</p>
          )}
        </div>
      </Popup>
    </div>
  );

  return (
    <div className="flex flex-col h-screen overflow-auto pb-5 gap-5 bg-neutral-900 text-white w-full">
      <div className="pt-4 px-5 flex items-center justify-between shrink-0">
        <h1 className="text-2xl">Busca de Mangás</h1>
      </div>

      <div className="w-full flex flex-col px-5 gap-2">
        <div className="flex w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            placeholder="Digite o nome do mangá..."
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearchTerm(searchQuery);
                searchMangas(searchQuery);
              }
            }}
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md"
            onClick={() => {
              setSearchTerm(searchQuery);
              searchMangas(searchQuery);
            }}
          >
            Buscar
          </button>
        </div>

        {searchTerm && (
          <div className="w-full  mt-2 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Buscando por: <span className="font-semibold">{searchTerm}</span>
            </p>
            <button
              className="text-sm text-red-600 hover:text-red-800"
              onClick={clearSearch}
            >
              Limpar busca
            </button>
          </div>
        )}
      </div>

      {sources.length > 0 && (
        <div className="px-5">
          {/* Seção MangaLivre */}
          {renderSourceSection(
            "Manga Livre",
            "manga-livre",
            results.mangaLivre.data,
            results.mangaLivre.loading,
            results.mangaLivre.error,
            results.mangaLivre.hasMore
          )}

          {/* Seção Seita Celestial */}
          {renderSourceSection(
            "Seita Celestial",
            "seita-celestial",
            results.seitaCelestial.data,
            results.seitaCelestial.loading,
            results.seitaCelestial.error,
            results.seitaCelestial.hasMore
          )}

          {/* Seção MangaDex */}
          {renderSourceSection(
            "MangaDex",
            "manga-dex",
            results.mangaDex.data,
            results.mangaDex.loading,
            results.mangaDex.error,
            results.mangaDex.hasMore
          )}
        </div>
      )}

      <button
        className="fixed bottom-4 left-4 z-50 bg-white cursor-pointer text-black px-2 py-2 rounded-2xl shadow-lg transition-colors duration-200 hover:bg-white/80"
        onClick={() => push("/reader/browse")}
      >
        <IoIosArrowDropleftCircle size={24} />
      </button>
    </div>
  );
}
