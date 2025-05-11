"use server";

import { Chapter } from "@/type/types";

function extractChapterSlug(url: string): string {
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 1];
}

export async function fetchChaptersFromMangaDex(
  mangaUrl: string
): Promise<Chapter[]> {
  const allChapters: Chapter[] = [];
  let offset = 0;
  const limit = 100;
  let total = Infinity;

  try {
    while (offset < total) {
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
        "order[chapter]": "desc",
        "translatedLanguage[]": "pt-br",
      });

      const url = `${mangaUrl}?${queryParams.toString()}`;

      const res = await fetch(url, { cache: "no-store" });

      if (!res.ok) {
        console.log(res);
        throw new Error(`Erro ao buscar capítulos do MangaDex: ${res.status}`);
      }

      const data = await res.json();

      total = data.total || 0;

      const chapters = data.data.map((item: any) => {
        const attributes = item.attributes;
        const chapterNumber = attributes.chapter || "0";
        const title = attributes.title
          ? `Capítulo ${chapterNumber} - ${attributes.title}`
          : `Capítulo ${chapterNumber}`;
        const date = new Date(attributes.readableAt).toLocaleDateString(
          "pt-BR"
        );
        const url = `https://mangadex.org/chapter/${item.id}`;
        const chapterSlug = extractChapterSlug(url);

        return { title, url, date, chapterSlug };
      });

      allChapters.push(...chapters);
      offset += limit;
    }

    return allChapters;
  } catch (error) {
    console.error("Erro ao buscar capítulos do MangaDex:", error);
    return allChapters;
  }
}
