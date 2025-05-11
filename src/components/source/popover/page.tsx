"use client";

import { favoriteManga } from "@/api/sources/geral/favoriteManga";
import { unfavoriteManga } from "@/api/sources/geral/unfavoriteManga";
import { verifyFavorited } from "@/api/sources/geral/verifyFavorited";
import MangaCard from "@/components/manga/mangaCard";
import { useEffect, useState } from "react";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import { toast } from "sonner";

export default function PopoverPage({
  url,
  sourceId,
  title,
  img,
  chapters,
  description,
}: {
  url: string;
  sourceId: string;
  title: string;
  img: string;
  chapters: string;
  description: string;
}) {
  const [isFavorite, setIsFavorite] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [openPopoverIndex, setOpenPopoverIndex] = useState<boolean>(false);

  useEffect(() => {
    const fetchFavorite = async () => {
      if (!openPopoverIndex) return;
      setIsLoading(true);

      const response = await verifyFavorited(url, sourceId);

      if (!response) {
        toast.error("Erro ao buscar favoritado");
        setOpenPopoverIndex(false);
        return;
      }

      if (response && response.isFavorite) {
        setIsFavorite(true);
      }

      setIsLoading(false);
    };

    fetchFavorite();
  }, [sourceId, url, openPopoverIndex]);

  return (
    <>
      <div className="relative inline-block">
        <MangaCard
          title={title}
          img={img}
          chapters={chapters}
          onClick={() => setOpenPopoverIndex((prev) => !prev)}
        />

        {openPopoverIndex && (
          <div className="absolute top-1 right-0 -translate-y-full bg-white p-3 rounded-xl shadow-lg z-40">
            {isLoading ? (
              <div className="flex justify-center items-center">
                <span className="text-black text-sm">Carregando...</span>
              </div>
            ) : isFavorite ? (
              <IoHeartSharp
                className="text-red-500 text-2xl cursor-pointer"
                onClick={async () => {
                  const response = await unfavoriteManga({ url }, sourceId);
                  if (response) {
                    setIsFavorite(false);
                    setOpenPopoverIndex(false);
                    return;
                  }
                  toast.error("Erro ao desfavoritar manga");
                }}
              />
            ) : (
              <IoHeartOutline
                className="text-red-500 text-2xl cursor-pointer"
                onClick={async () => {
                  const response = await favoriteManga(
                    {
                      title,
                      chapters,
                      description,
                      img,
                      url,
                    },
                    sourceId
                  );
                  if (response) {
                    setIsFavorite(true);
                    setOpenPopoverIndex(false);
                    return;
                  }
                  toast.error("Erro ao favoritar manga");
                }}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
}
