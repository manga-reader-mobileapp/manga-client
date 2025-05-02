"use client";

import { favoriteManga } from "@/api/sources/geral/favoriteManga";
import { unfavoriteManga } from "@/api/sources/geral/unfavoriteManga";
import { verifyFavorited } from "@/api/sources/geral/verifyFavorited";
import MangaCard from "@/components/manga/mangaCard";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { useEffect, useState } from "react";
import { IoHeartOutline } from "react-icons/io5";
import { IoHeartSharp } from "react-icons/io5";
import { toast } from "sonner";

export default function PopoverPage({
  url,
  sourceId,
  title,
  img,
  chapters,
}: {
  url: string;
  sourceId: string;
  title: string;
  img: string;
  chapters: string;
}) {
  const [isFavorite, setIsFavorite] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [openPopoverIndex, setOpenPopoverIndex] = useState<boolean>(false);

  useEffect(() => {
    const fetchFavorite = async () => {
      if (!openPopoverIndex) return;
      setIsLoading(true);

      const response = await verifyFavorited(url, sourceId);
      if (response && response.isFavorite) {
        setIsFavorite(true);
      }

      setIsLoading(false);
    };

    fetchFavorite();
  }, [sourceId, url, openPopoverIndex]);

  return (
    <Popover onOpenChange={() => setOpenPopoverIndex(!openPopoverIndex)}>
      <PopoverTrigger>
        <MangaCard title={title} img={img} chapters={chapters} />
      </PopoverTrigger>

      <PopoverContent>
        {isLoading ? (
          <div className="flex justify-center items-center">
            <span className="text-white text-sm">Carregando...</span>
          </div>
        ) : isFavorite ? (
          <IoHeartSharp
            className="text-white text-2xl cursor-pointer"
            onClick={async () => {
              const response = await unfavoriteManga(
                {
                  url: url,
                },
                sourceId
              );

              if (response) {
                setIsFavorite(false);
                return;
              }

              toast.error("Erro ao desfavoritar manga");
            }}
          />
        ) : (
          <IoHeartOutline
            className="text-white text-2xl cursor-pointer"
            onClick={async () => {
              const response = await favoriteManga(
                {
                  title: title,
                  author: "",
                  chapters: chapters,
                  description: "",
                  img: img,
                  url: url,
                },
                sourceId
              );

              if (response) {
                setIsFavorite(true);

                return;
              }

              toast.error("Erro ao favoritar manga");
            }}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
