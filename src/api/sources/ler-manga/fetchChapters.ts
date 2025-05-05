"use server";

import { Chapter } from "@/type/types";
import { load } from "cheerio";

export async function fetchChaptersFromLerMangas(
  url: string,
  mangaId: string
): Promise<Chapter[]> {
  try {
    const ajaxUrl = `${url}/manga/${mangaId}/ajax/chapters/`;

    const res = await fetch(ajaxUrl, {
      method: "POST",
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

      throw new Error(`Erro ao buscar capítulos AJAX: ${res.status}`);
    }

    const html = await res.text();
    const $ = load(html);

    const chapters: Chapter[] = [];

    $(".wp-manga-chapter").each((_, element) => {
      const a = $(element).find("a");
      const title = a.text().trim();
      const url = a.attr("href") || "";
      const date = $(element).find(".chapter-release-date i").text().trim();

      chapters.push({ title, url, date });
    });

    return chapters;
  } catch (error) {
    console.error("Erro ao buscar capítulos:", error);
    return [];
  }
}
