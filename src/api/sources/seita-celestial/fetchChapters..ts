"use server";

import { Chapter } from "@/type/types";
import { load } from "cheerio";

function extractChapterFromUrl(url: string): string {
  const match = url.match(/chapter-(.*?)(\/|$)/); // Procura por "chapter-" e tudo após isso
  return match ? match[1] : ""; // Retorna o capítulo ou uma string vazia se não encontrar
}

export async function fetchChaptersFromSeitaCelestial(
  baseUrl: string
): Promise<Chapter[]> {
  try {
    const res = await fetch(baseUrl, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        Connection: "keep-alive",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Erro ao buscar HTML: ${res.status}`);
    }

    const html = await res.text();
    const $ = load(html);

    const chapters: Chapter[] = [];

    $("li[data-num]").each((_, el) => {
      const a = $(el).find("a");
      const title = a.find(".chapternum").text().trim();
      const url = a.attr("href") || "";
      const date = a.find(".chapterdate").text().trim();

      if (title && url) {
        if (title.includes("{{number}}")) return;

        const chapterSlug = extractChapterFromUrl(url);

        chapters.push({ title, url, date, chapterSlug });
      }
    });

    return chapters;
  } catch (error) {
    console.error("Erro ao buscar capítulos da Seita Celestial:", error);
    return [];
  }
}
