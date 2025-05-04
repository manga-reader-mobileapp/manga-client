"use server";

import { load } from "cheerio";

function cleanMangaId(mangaId: string): string {
  return mangaId.replace(/^\/|\/$/g, "");
}

export async function searchMangasLerMangas(
  baseUrl: string,
  query: string,
  page: number = 1
) {
  const searchUrl =
    page === 1
      ? `${baseUrl}/?s=${encodeURIComponent(query)}&post_type=wp-manga`
      : `${baseUrl}/page/${page}/?s=${encodeURIComponent(
          query
        )}&post_type=wp-manga`;

  try {
    const res = await fetch(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Erro ao buscar mangás: ${res.status}`);
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

    $(".c-tabs-item__content").each((_, element) => {
      const title = $(element).find(".post-title h3 a").text().trim();

      const img = $(element).find(".tab-thumb img").attr("src") || "";

      const chapterText = $(element)
        .find(".tab-meta .latest-chap .chapter a")
        .text()
        .trim();
      const chapters = chapterText.replace(/[^0-9]/g, "") || "0";

      const rawUrl = $(element).find(".post-title h3 a").attr("href") || "";
      const mangaUrl = rawUrl.replace("https://lermangas.me/manga", "");

      mangas.push({
        title,
        img,
        chapters,
        url: cleanMangaId(mangaUrl),
        description: "", // conforme solicitado
      });
    });

    return mangas;
  } catch (error) {
    console.error("Erro ao buscar mangás:", error);
    return [];
  }
}
