"use server";

import { load } from "cheerio";

function cleanMangaId(mangaId: string): string {
  return mangaId.replace(/^\/|\/$/g, "");
}

export async function fetchMangasLerMangas(page: number) {
  const baseUrl = "https://lermangas.me/manga";
  const pageUrl = page === 1 ? baseUrl : `${baseUrl}/page/${page}/`;

  try {
    const res = await fetch(pageUrl, {
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

    $(".page-item-detail.manga").each((_, element) => {
      const title = $(element).find(".post-title a").text().trim();
      const img = $(element).find(".item-thumb img").attr("src") || "";

      const chapterText = $(element)
        .find(".list-chapter .chapter-item")
        .first()
        .find(".chapter a")
        .text()
        .trim();
      const chapters = chapterText.replace(/[^0-9]/g, "");

      const rawUrl = $(element).find(".post-title a").attr("href") || "";
      const mangaUrl = rawUrl.replace("https://lermangas.me/manga", "");

      mangas.push({
        title,
        img,
        chapters,
        url: cleanMangaId(mangaUrl),
        description: "",
      });
    });

    return mangas;
  } catch (error) {
    console.error("Erro ao buscar mangas:", error);
    return [];
  }
}
