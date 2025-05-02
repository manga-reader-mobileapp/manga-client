"use client";

import { IoIosArrowDropleftCircle } from "react-icons/io";
import { IoHeartSharp, IoHeartOutline } from "react-icons/io5";
import { BsGlobe2 } from "react-icons/bs";
import { FiShare2 } from "react-icons/fi";
import { useEffect, useState } from "react";
import { Manga } from "@/type/types";
import { getUniqueManga } from "@/api/library/unique/getUniqueManga";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function MangaPage({ params }: { params: { id: string } }) {
  const { back } = useRouter();

  const [manga, setmManga] = useState<Manga>({
    id: params.id,
    title: "x",
    description: "",
    img: "",
    chapters: 0,
    source: "Manga Livre",
    sourceUrl: "",
    url: "",
    isFavorite: true,
    lastChapter: 0,
  });

  useEffect(() => {
    const getManga = async () => {
      if (!params.id) return;

      const response = await getUniqueManga(params.id);

      if (response) {
        setmManga(response);
      } else {
        back();
      }
    };

    getManga();
  }, [params.id]); // Observe params.id para buscar os dados quando o parâmetro mudar

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-4 space-y-4 w-full">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          className="text-white text-2xl"
          onClick={() => window.history.back()}
        >
          <IoIosArrowDropleftCircle />
        </button>
        {/* <span className="text-lg font-semibold">{manga.title}</span> */}
        <div className="w-6" /> {/* Espaço para equilibrar layout */}
      </div>

      {/* Manga Info */}
      <div className="flex gap-4">
        <img
          src={manga.img || "https://placehold.co/600x400/EEE/31343C"}
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
                manga.lastChapter ? manga.chapters <= manga.lastChapter : false
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

      {/* Capítulos */}
      <div className="bg-neutral-800 p-4 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-white font-semibold">Capítulos</span>
        </div>

        {/* Capítulo de teste */}
        <div className="flex items-center justify-between bg-neutral-700 p-3 rounded-xl">
          <div>
            <span className="text-sm font-medium">Vol.1 Ch.1 - Prólogo</span>
            <p className="text-xs text-gray-400">2023-08-14 • ScanXYZ</p>
          </div>
        </div>
      </div>
    </div>
  );
}
