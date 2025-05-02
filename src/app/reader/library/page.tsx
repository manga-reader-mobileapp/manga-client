"use client";

import { getListCategory } from "@/api/login/category/getAll copy";
import MangaList from "@/components/manga/MangaList";
import BottomMenu from "@/components/menu/bottomMenu";
import { Category } from "@/type/types";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdFilterList } from "react-icons/md";

export default function LibraryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const getAll = async () => {
      const response = await getListCategory();

      if (response) {
        setCategories(response);

        if (response.length > 0) {
          setSelectedCategory(response[0].id);
        }
      }
    };

    getAll();
  }, []);

  return (
    <div className="bg-neutral-900 min-h-screen w-full pt-4 px-5 text-white">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 justify-between">
        <h1 className="text-2xl">Library</h1>

        <div className="flex items-center gap-4">
          <FaSearch size={17} />

          <MdFilterList size={24} />
        </div>
      </div>

      {/* Categories */}
      <div className="overflow-x-auto mb-6">
        <div className="flex gap-2">
          {categories.map((category) => {
            const isSelected = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`relative px-4 py-2 text-sm transition-all flex flex-col items-center cursor-pointer ${
                  isSelected
                    ? "text-purple-500 font-bold"
                    : "text-white hover:text-white"
                } group`}
              >
                <span className="flex items-center gap-1">
                  {category.name}
                  <span className="bg-neutral-800 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {category._count?.SavedManga || 0}
                  </span>
                </span>

                {/* Linha rosa se selecionado */}
                {isSelected && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4/5 h-1 bg-purple-500 rounded-full mt-1"></span>
                )}

                {/* Linha cinza se hover e não for selecionado */}
                {!isSelected && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4/5 h-1 bg-neutral-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity mt-1"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Manga List */}
      <MangaList
        mangaData={[
          {
            id: "1",
            title: "Manga 1",
            img: "https://picsum.photos/id/10/200/300",
            chapters: "100",
          },
          {
            id: "2",
            title: "Manga 2",
            img: "https://picsum.photos/id/10/200/300",
            chapters: "100",
          },
          {
            id: "3",
            title: "Manga 3",
            img: "https://picsum.photos/id/10/200/300",
            chapters: "100",
          },
          {
            id: "4",
            title: "Manga 4",
            img: "https://picsum        .photos/id/10/200/300",
            chapters: "100",
          },
          {
            id: "5",
            title: "Manga 5",
            img: "https://picsum.photos/id/10/200/300",
            chapters: "100",
          },
          {
            id: "6",
            title: "Manga 6",
            img: "https://picsum.photos/id/10/200/300",
            chapters: "100",
          },
          {
            id: "7",
            title: "Manga 7",
            img: "https://picsum.photos/id/10/200/300",
            chapters: "100",
          },
          {
            id: "8",
            title: "Manga 8",
            img: "https://picsum        .photos/id/10/200/300",
            chapters: "100",
          },
          {
            id: "9",
            title: "Manga 9",
            img: "https://picsum.photos/id/10/200/300",
            chapters: "100",
          },
          {
            id: "0",
            title: "Manga 0",
            img: "https://picsum.photos/id/10/200/300",
            chapters: "100",
          },
          {
            id: "1",
            title: "Manga 1",
            img: "https://picsum.photos/id/10/200/300",
            chapters: "100",
          },
          {
            id: "2",
            title: "Manga 2",
            img: "https://picsum.photos/id/10/200/300",
            chapters: "100",
          },
          {
            id: "3",
            title: "Manga 3",
            img: "https://picsum.photos/id/10/200/300",
            chapters: "100",
          },
          {
            id: "4",
            title: "Manga 4",
            img: "https://picsum        .photos/id/10/200/300",
            chapters: "100",
          },
          {
            id: "5",
            title: "Manga 5",
            img: "https://picsum.photos/id/10/200/300",
            chapters: "100",
          },
          {
            id: "6",
            title: "Manga 6",
            img: "https://picsum.photos/id/10/200/300",
            chapters: "100",
          },
          {
            id: "7",
            title: "Manga 7",
            img: "https://picsum.photos/id/10/200/300",
            chapters: "100",
          },
          {
            id: "8",
            title: "Manga 8",
            img: "https://picsum        .photos/id/10/200/300",
            chapters: "100",
          },
        ]}
      />

      {/* Pagination */}
      <BottomMenu />
    </div>
  );
}
