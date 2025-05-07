"use server";

import { load } from "cheerio";

function cleanMangaId(url: string): string {
  const match = url.match(/comics\/([^/]+)/);
  return match ? match[1] : "";
}

export async function searchMangasSeitaCelestial(
  baseUrl: string,
  query: string,
  page = 1
) {
  try {
    const url = `${baseUrl}/${
      page > 1 ? `page/${page}/` : ""
    }?s=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
      },
      cache: "no-store",
    });

    const html = await res.text();
    const $ = load(html);

    const results: {
      title: string;
      img: string;
      chapters: string;
      url: string;
      description: string;
    }[] = [];

    $("a[href*='/comics/']").each((_, el) => {
      const link = $(el).attr("href") || "";
      const img = $(el).find("img").attr("src") || "";
      const title =
        $(el).find(".tt").text().trim() || $(el).attr("title") || "";
      const chapters = $(el).find(".epxs").text().trim() || "0";

      if (title === "") return;

      results.push({
        title,
        img,
        chapters,
        url: cleanMangaId(link),
        description: "",
      });
    });

    return results;
  } catch (error) {
    console.error("Erro ao buscar mangás da Seita Celestial:", error);
    return [];
  }
}
