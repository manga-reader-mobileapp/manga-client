"use server";

import { load } from "cheerio";

export async function fetchPagesFromLerMangas(chapterUrl: string) {
  try {
    const res = await fetch(chapterUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        Referer: "https://mangalivre.tv/",
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

    const chapterImages: {
      imageUrl: string;
      pageNumber: number;
    }[] = [];

    const currentChapterId =
      $("#wp-manga-current-chap").attr("value")?.trim() || "";

    $(".page-break.no-gaps").each((index, element) => {
      let imageUrl =
        $(element).find("img.wp-manga-chapter-img").attr("src") || "";

      // Limpa espaços em branco e quebras de linha
      imageUrl = imageUrl.replace(/\s+/g, "");

      if (imageUrl) {
        chapterImages.push({
          imageUrl,
          pageNumber: index + 1,
        });
      }
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
