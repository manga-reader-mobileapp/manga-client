"use server";

import { load } from "cheerio";

export async function fetchPagesFromMangalivre(chapterUrl: string) {
  try {
    const res = await fetch(chapterUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Erro ao buscar capítulo: ${res.status}`);
    }

    const html = await res.text();
    const $ = load(html);

    const chapterImages: {
      imageUrl: string;
      pageNumber: number;
    }[] = [];

    // Pegando o ID do capítulo atual (pode ser útil para navegação ou histórico)
    const currentChapterId = $("#wp-manga-current-chap").attr("value") || "";

    // Extraindo todas as imagens do capítulo
    $(".page-break.no-gaps").each((index, element) => {
      const imageUrl =
        $(element).find("img.wp-manga-chapter-img").attr("src")?.trim() || "";

      // Remover espaços em branco no início da URL (como no seu exemplo)
      const cleanImageUrl = imageUrl.replace(/^\s+/, "");

      chapterImages.push({
        imageUrl: cleanImageUrl,
        pageNumber: index + 1, // Começa em 1
      });
    });

    console.log({
      chapterId: currentChapterId,
      totalPages: chapterImages.length,
      images: chapterImages,
    });

    return {
      chapterId: currentChapterId,
      totalPages: chapterImages.length,
      images: chapterImages,
    };
  } catch (error) {
    console.error("Erro ao buscar imagens do capítulo:", error);
    return {
      chapterId: "",
      totalPages: 0,
      images: [],
    };
  }
}
