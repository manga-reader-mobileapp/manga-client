"use client";

import { getListCategory } from "@/api/category/getAll";
import { getUniqueManga } from "@/api/library/unique/getUniqueManga";
import { updateLastRead } from "@/api/library/unique/updateLastRead";
import { updateMangaCategory } from "@/api/library/updateCategory";
import { updateLastChapter } from "@/api/library/updateLastChapter";
import { favoriteSavedManga } from "@/api/sources/geral/favoriteSavedManga";
import { unfavoriteManga } from "@/api/sources/geral/unfavoriteManga";
import { fetchChaptersFromMangalivre } from "@/api/sources/manga-livre/fetchChapters";
import { fetchChaptersFromSeitaCelestial } from "@/api/sources/seita-celestial/fetchChapters.";
import Popup from "@/components/popup/page";
import ShareButton from "@/components/tools/sharingButton";
import { Button } from "@/components/ui/button";
import { extractChapterNumber } from "@/services/extractChapterNumber";
import { replaceDotsWithHyphens } from "@/services/replaceDotsWithHyphens";
import { Category, Chapter, Manga } from "@/type/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BsGlobe2 } from "react-icons/bs";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { IoEyeSharp, IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import { MdLabelOutline } from "react-icons/md";

import { toast } from "sonner";

export default function MangaPage() {
  const params = useParams();
  const mangaId =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : "";

  const { back, push } = useRouter();

  const [manga, setManga] = useState<Manga>({
    id: mangaId,
    title: "",
    description: "",
    img: "",
    chapters: "0",
    source: "",
    sourceUrl: "",
    url: "",
    isFavorite: true,
  });

  const [chapters, setChapters] = useState<Chapter[]>([]);

  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const [lastChapter, setLastChapter] = useState<{
    number: number;
    raw: string;
  } | null>(null);

  const [firstChapter, setFirstChapter] = useState<{
    number: number;
    raw: string;
  } | null>(null);

  const getChapters = async (url: string) => {
    if (!manga.url) return;

    if (manga.sourceName === "manga-livre") {
      const response = await fetchChaptersFromMangalivre(url, manga.url);

      if (!response) return;
      setChapters(response);

      setFirstChapter(
        extractChapterNumber(response[response.length - 1].title)
      );

      const lastChapter = extractChapterNumber(response[0].title);

      setLastChapter(lastChapter);

      if (lastChapter.number !== extractChapterNumber(manga.chapters).number) {
        await updateLastChapter(mangaId, {
          chapter: lastChapter.raw,
        });
      }
    }

    if (manga.sourceName === "seita-celestial") {
      const response = await fetchChaptersFromSeitaCelestial(
        url + "/comics/" + manga.url
      );

      if (!response) return;
      setChapters(response);

      setFirstChapter(
        extractChapterNumber(response[response.length - 1].title)
      );

      const lastChapter = extractChapterNumber(response[0].title);

      setLastChapter(lastChapter);

      if (lastChapter.number !== extractChapterNumber(manga.chapters).number) {
        await updateLastChapter(mangaId, {
          chapter: lastChapter.raw,
        });
      }
    }
  };

  useEffect(() => {
    const getManga = async () => {
      if (!mangaId) return;

      const response = await getUniqueManga(mangaId);

      if (response) {
        setManga(response);

        getChapters(response.sourceUrl);
      } else {
        back();
      }
    };

    getManga();
  }, [mangaId, back, manga.url]);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!isOpen) return;

      if (!!categories[0]) return;

      const response = await getListCategory();

      if (response) {
        setCategories(response);
      }
    };

    fetchCategories();
  }, [isOpen]);

  const updateCategory = async (categoryId: string) => {
    const response = await updateMangaCategory({
      mangaId: [mangaId],
      categoryId,
    });

    if (!response) {
      toast.error("Erro ao atualizar categoria");
      return;
    }

    return response;
  };

  const hadlePushChapter = (chapterNumber: Chapter) => {
    push(
      `/reader/library/pages/${manga.sourceName}/${manga.url}/${chapterNumber.chapterSlug}`
    );
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col w-full">
      {/* Fixed Top Section */}
      <div className="p-4 space-y-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between pb-4">
          <button
            className="text-white text-2xl cursor-pointer"
            onClick={() => push(`/reader/library`)}
          >
            <IoIosArrowDropleftCircle />
          </button>

          <MdLabelOutline
            className="cursor-pointer"
            size={28}
            onClick={() => setIsOpen(true)}
          />
        </div>

        {/* Manga Info */}
        <div className="flex gap-4">
          <img
            src={manga.img || "/images/noimage.png"}
            alt={manga.title}
            width={100}
            height={150}
            className="rounded-lg object-cover"
          />

          <div className="flex flex-col justify-between flex-1">
            <h2 className="text-xl font-bold">{manga.title}</h2>
            <p className="text-sm text-gray-300 line-clamp-3">
              {manga.sourceTitle}
            </p>

            <p className="text-sm  text-gray-300 line-clamp-3 pb-4">
              {!!manga.description ? manga.description : "Sem descrição"}
            </p>

            <div className="flex gap-4 mt-2">
              {manga.isFavorite ? (
                <IoHeartSharp
                  className="text-red-500 text-2xl cursor-pointer"
                  onClick={async () => {
                    if (!manga.url) return;

                    const response = await unfavoriteManga(
                      { url: manga.url },
                      manga.source
                    );

                    if (response) {
                      setManga((prev) => {
                        return {
                          ...prev,
                          isFavorite: false,
                        };
                      });
                      return;
                    }

                    toast.error("Erro ao desfavoritar manga");
                  }}
                />
              ) : (
                <IoHeartOutline
                  className="text-red-500 text-2xl cursor-pointer"
                  onClick={async () => {
                    const response = await favoriteSavedManga(mangaId);

                    if (response) {
                      setManga((prev) => {
                        return {
                          ...prev,
                          isFavorite: true,
                        };
                      });

                      return;
                    }
                    toast.error("Erro ao favoritar manga");
                  }}
                />
              )}
              <button className="text-white text-xl">
                <BsGlobe2
                  className="cursor-pointer"
                  onClick={() => {
                    if (
                      manga.sourceName === "manga-livre" ||
                      manga.sourceName === "ler-mangas"
                    ) {
                      window.open(
                        manga.sourceUrl + "/manga/" + manga.url,
                        "_blank"
                      );
                    }

                    if (manga.sourceName === "seita-celestial") {
                      window.open(
                        manga.sourceUrl + "/comics/" + manga.url,
                        "_blank"
                      );
                    }
                  }}
                />
              </button>
              <ShareButton />
            </div>
          </div>
        </div>

        {!!lastChapter?.raw && !!firstChapter?.raw ? (
          lastChapter.raw === manga.lastChapter ? (
            <Button
              disabled
              variant="default"
              className=" text-white px-4 rounded-2xl w-full py-2 text-sm"
            >
              Sem próximo capitulo
            </Button>
          ) : (
            <button
              className="bg-blue-600 text-white px-4 rounded-2xl w-full py-2 text-sm cursor-pointer hover:bg-blue-500"
              onClick={() => {
                // Se não leu nenhum capítulo ainda
                if (!manga.lastChapter) {
                  push(
                    `/reader/library/pages/${manga.sourceName}/${
                      manga.url
                    }/${replaceDotsWithHyphens(firstChapter.raw)}`
                  );
                  return;
                }

                // Já leu algum capítulo
                const currentIndex = chapters.findIndex(
                  (ch) =>
                    extractChapterNumber(ch.title).raw === manga.lastChapter
                );

                // Se o capítulo atual não está na lista, fallback para o primeiro
                if (currentIndex === -1) {
                  push(
                    `/reader/library/pages/${manga.sourceName}/${
                      manga.url
                    }/${replaceDotsWithHyphens(firstChapter.raw)}`
                  );
                  return;
                }

                // Pegar o próximo capítulo, se existir
                const next = extractChapterNumber(
                  chapters[currentIndex - 1].title
                ).raw;

                if (next) {
                  push(
                    `/reader/library/pages/${manga.sourceName}/${
                      manga.url
                    }/${replaceDotsWithHyphens(next)}`
                  );
                } else {
                  alert("Você já está no último capítulo.");
                }
              }}
            >
              Ler próximo capítulo
            </button>
          )
        ) : (
          <Button
            disabled
            variant="default"
            className=" text-white px-4 rounded-2xl w-full py-2 text-sm"
          >
            Carregando...
          </Button>
        )}
      </div>

      {/* Scrollable Chapters Section */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="bg-neutral-800 p-4 rounded-t-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white font-semibold">Capítulos</span>
          </div>

          {/* Capítulos */}
          {chapters.map((chapter, index) => {
            const chapterNumber = extractChapterNumber(chapter.title);

            const readed = manga.lastChapter
              ? Number(chapterNumber.number) <= Number(manga.lastChapter)
              : false;

            return (
              <div
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer hover:bg-neutral-600
                ${readed ? "bg-neutral-800 opacity-50" : "bg-neutral-700"}
              `}
                key={index}
                onClick={() => {
                  hadlePushChapter(chapter);
                }}
              >
                <div>
                  <span className="text-sm font-medium">{chapter.title}</span>
                  <p className="text-xs text-gray-400">{chapter.date}</p>
                </div>

                <div
                  className="flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();

                    toast.custom(
                      (t) => (
                        <div className="p-4 bg-[var(--normal-bg)] border border-[var(--normal-border)] text-[var(--normal-text)] rounded-[var(--border-radius)] shadow-md w-[var(--width)] flex items-center gap-3">
                          <div className="flex flex-col gap-2">
                            <p className="text-xs text-default-500">
                              Tem certeza? Esse será o último capitulo lido.
                            </p>
                          </div>

                          <div className="flex gap-1">
                            <Button
                              variant="destructive"
                              onClick={() => toast.dismiss(t)}
                              className="cursor-pointer"
                            >
                              Cancelar
                            </Button>
                            <Button
                              variant="default"
                              className="cursor-pointer"
                              onClick={async () => {
                                const response = await updateLastRead(mangaId, {
                                  chapter: chapterNumber.raw,
                                  forceUpdate: true,
                                });

                                if (!response) {
                                  return;
                                }

                                toast.dismiss(t);

                                setManga((prev) => {
                                  return {
                                    ...prev,
                                    lastChapter: chapterNumber.raw,
                                  };
                                });
                              }}
                            >
                              Atualizar
                            </Button>
                          </div>
                        </div>
                      ),
                      {
                        position: "bottom-left",
                      }
                    );
                  }}
                >
                  <IoEyeSharp className="text-white text-2xl" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Popup isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className=" w-[300px]">
          <div className="flex items-center justify-between pb-4">
            <span className="text-neutral-800 font-semibold">Categorias</span>
          </div>

          <div className="flex flex-col gap-2">
            {!!categories[0] ? (
              categories.map((category) => (
                <button
                  key={category.id}
                  onClick={async () => {
                    if (manga.categoryId === category.id) return;

                    setIsOpen(false);

                    const response = await updateCategory(category.id);

                    if (response) {
                      setManga((prev) => {
                        return {
                          ...prev,
                          categoryId: category.id,
                        };
                      });
                    }
                  }}
                  className={`flex items-center gap-2 p-2 rounded-lg ${
                    manga.categoryId === category.id
                      ? "bg-violet-500"
                      : "hover:bg-neutral-400 cursor-pointer"
                  }`}
                >
                  <MdLabelOutline size={20} />

                  <span
                    className={`${
                      manga.categoryId === category.id
                        ? "text-white"
                        : "text-neutral-800"
                    }`}
                  >
                    {category.name}
                  </span>
                </button>
              ))
            ) : (
              <div className="flex justify-center items-center">
                <p className="text-neutral-800">Carregando categorias</p>
              </div>
            )}
          </div>
        </div>
      </Popup>
    </div>
  );
}
