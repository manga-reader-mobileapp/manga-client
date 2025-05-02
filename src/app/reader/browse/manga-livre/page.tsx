"use client";

import { getUniqueSource } from "@/api/sources/getUniqueSource";
import { fetchMangasMangaLivre } from "@/api/sources/manga-livre/fetchMangas";
import PopoverPage from "@/components/source/popover/page";
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

  const fetchMangas = useCallback(async (page: number) => {
    if (isLoadingRef.current) return;

    const source = await getUniqueSource("manga-livre");

    if (!source) return;

    setSource(source);

    setLoading(true);
    isLoadingRef.current = true;

    try {
      const res = await fetchMangasMangaLivre(page, source.url);
      if (res && Array.isArray(res)) {
        setMangas((prev) => [...prev, ...res]);
      }
    } catch (error) {
      console.error("Erro ao buscar mangas:", error);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    fetchMangas(page);
  }, [page, fetchMangas]);

  useEffect(() => {
    // Certifique-se de que o observerRef está realmente apontando para um elemento
    if (!observerRef.current) return;

    // Crie um novo observer
    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingRef.current) {
          setPage((prev) => prev + 1);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1, // Torna a detecção mais sensível
      }
    );

    // Inicie a observação
    observer.current.observe(observerRef.current);

    // Limpe o observer quando o componente for desmontado
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [mangas.length]); // Dependência em mangas.length para recriar o observer quando novos mangas forem carregados

  return (
    <div className="flex flex-col h-screen gap-5 bg-neutral-900 text-white w-full">
      <div className="pt-4 px-5 flex items-center justify-between shrink-0">
        <h1 className="text-2xl">Manga Livre</h1>
      </div>

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
