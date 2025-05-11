"use server";

import { Pages } from "@/type/types";

export async function fetchPagesFromMangaDex(chapterId: string) {
  try {
    const res = await fetch(
      `https://api.mangadex.org/at-home/server/${chapterId}?forcePort443=false`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error(`Erro ao buscar servidor do capítulo: ${res.status}`);
    }

    const data = await res.json();

    const baseUrl = data.baseUrl;
    const hash = data.chapter.hash;
    const images = data.chapter.data;

    const pages: Pages[] = images.map((fileName: string, index: number) => ({
      imageUrl: `${baseUrl}/data/${hash}/${fileName}`,
      pageNumber: index + 1,
    }));

    return {
      chapterId,
      totalPages: pages.length,
      images: pages,
    };
  } catch (error) {
    console.error("Erro ao buscar páginas do MangaDex:", error);
    return {
      chapterId,
      totalPages: 0,
      images: [],
    };
  }
}
