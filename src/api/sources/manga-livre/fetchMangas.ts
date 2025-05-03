"use server";

import { load } from "cheerio";

function cleanMangaId(mangaId: string): string {
  return mangaId.replace(/^\/|\/$/g, "");
}

export async function fetchMangasMangaLivre(page: number, url: string) {
  try {
    const res = await fetch(`${page === 1 ? url : `${url}/page/${page}/`}`, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Erro ao buscar página: ${res.status}`);
    }

    const html = await res.text();
    const $ = load(html);

    const mangas: {
      title: string;
      img: string;
      chapters: string;
      url: string;
      description: string;
    }[] = [];

    $(".manga__item").each((_, element) => {
      const title = $(element).find(".post-title h2 a").text().trim();
      const img = $(element).find(".manga__thumb_item img").attr("src") || "";
      // Correção aqui: usando o seletor correto para o último capítulo e extraindo apenas o número
      const chapterText = $(element)
        .find(".list-chapter .chapter-item")
        .first()
        .find(".chapter a")
        .text()
        .trim();

      const rawUrl = $(element).find(".manga__thumb_item a").attr("href") || "";
      const mangaUrl = rawUrl.replace(`${url}/manga`, "");

      // Extrair apenas o número do capítulo
      const chapters = chapterText.replace(/[^0-9]/g, "");

      const description = $(element).find(".manga-excerpt p").text().trim();

      mangas.push({
        title,
        img,
        chapters,
        url: cleanMangaId(mangaUrl),
        description,
      });
    });

    return mangas;
  } catch (error) {
    console.error("Erro ao buscar mangas:", error);
    return [];
  }
}
