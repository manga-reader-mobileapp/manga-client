"use client";

import { getListCategory } from "@/api/category/getAll";
import { getMangaByCategories } from "@/api/library/getMangaByCategories";
import MangaList from "@/components/manga/mangaList";
import BottomMenu from "@/components/menu/bottomMenu";
import { Category, Manga } from "@/type/types";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdFilterList } from "react-icons/md";

export default function LibraryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);

  const [mangaList, setMangaList] = useState<Manga[]>([]);

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

  useEffect(() => {
    const getMangas = async () => {
      if (selectedCategory === "") return;

      setMangaList([]);

      const response = await getMangaByCategories(selectedCategory);

      if (response) {
        setMangaList(response);
      }
    };

    getMangas();
  }, [selectedCategory]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-neutral-900 text-white w-full">
      {/* Header fixo */}
      <div className="pt-4 px-5 flex items-center justify-between shrink-0">
        <h1 className="text-2xl">Library</h1>
        <div className="flex items-center gap-4">
          <FaSearch size={17} />
          <MdFilterList size={24} />
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 overflow-x-auto shrink-0">
        <div className="flex gap-2 py-4 min-w-max">
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

      {/* Conteúdo com scroll vertical */}
      <div className="flex-1 overflow-y-auto px-2 pb-20">
        <MangaList mangaData={mangaList} />
      </div>

      {/* BottomMenu fixo */}
      <BottomMenu />
    </div>
  );
}
