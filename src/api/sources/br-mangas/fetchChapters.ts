"use server";

import { Chapter } from "@/type/types";
import { load } from "cheerio";

function extractChapterSlug(chapterUrl: string): string {
  const parts = chapterUrl.split("/").filter(Boolean); // Remove strings vazias
  return parts[parts.length - 1]; // Última parte da URL
}

export async function fetchChaptersFromBrMangas(
  url: string,
  mangaId: string
): Promise<Chapter[]> {
  try {
    const mangaUrl = `${url}/manga/${mangaId}/`;

    console.log(mangaUrl);

    const res = await fetch(mangaUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        Referer: url,
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
      throw new Error(`Erro ao buscar página do mangá: ${res.status}`);
    }

    const html = await res.text();
    const $ = load(html);

    const chapters: Chapter[] = [];

    $(".wp-manga-chapter").each((_, element) => {
      const a = $(element).find("a").first();
      const title = a.text().trim();
      const url = a.attr("href") || "";

      const dateElement = $(element).find(".chapter-release-date");

      let date = "";
      const newTagElement = dateElement.find(".c-new-tag");
      if (newTagElement.length > 0) {
        date = newTagElement.attr("title") || "";
      } else {
        date = dateElement.text().trim();
      }

      const chapterSlug = extractChapterSlug(url);

      chapters.push({ title, url, date, chapterSlug });
    });

    return chapters;
  } catch (error) {
    console.error("Erro ao buscar capítulos:", error);
    return [];
  }
}
