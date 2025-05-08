"use server";

import { Pages } from "@/type/types";
import { load } from "cheerio";

export async function fetchPagesFromBrMangas(chapterUrl: string) {
  console.log(chapterUrl);
  try {
    const res = await fetch(chapterUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        Referer: new URL(chapterUrl).origin,
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-User": "?1",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.log(res);
      throw new Error(`Erro ao buscar capítulo: ${res.status}`);
    }

    const html = await res.text();
    const $ = load(html);

    const chapterImages: Pages[] = [];

    // Tentando pegar o ID do capítulo atual se disponível
    const currentChapterId =
      $("#wp-manga-current-chap").attr("value") ||
      $("input[name='chapter_id']").attr("value") ||
      "";

    // Extraindo todas as imagens do capítulo baseado no HTML fornecido
    $(".page-break.no-gaps").each((index, element) => {
      // Busca a imagem e obtém a URL
      let imageUrl =
        $(element).find("img.wp-manga-chapter-img").attr("src") || "";

      // Limpa a URL de espaços em branco no início e fim
      imageUrl = imageUrl.trim();

      // Se depois de limpar ainda houver quebras de linha ou múltiplos espaços, limpa também
      imageUrl = imageUrl.replace(/\s+/g, " ");

      if (imageUrl) {
        chapterImages.push({
          imageUrl: imageUrl,
          pageNumber: index + 1, // Começa em 1
        });
      }
    });

    console.log(chapterImages);

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
