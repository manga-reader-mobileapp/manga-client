"use server";

import { Chapter } from "@/type/types";
import { load } from "cheerio";

export async function fetchChaptersFromMangalivre(
  url: string,
  mangaId: string
): Promise<Chapter[]> {
  try {
    const ajaxUrl = `${url}/manga/${mangaId}/ajax/chapters/`;

    const res = await fetch(ajaxUrl, {
      method: "POST",
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "*/*",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      cache: "no-store",
    });

    if (!res.ok) {
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
