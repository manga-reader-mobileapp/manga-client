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
