"use server";

import { load } from "cheerio";
const controller = new AbortController();

function cleanMangaId(url: string): string {
  const match = url.match(/comics\/([^/]+)/);
  return match ? match[1] : "";
}

export async function fetchMangasSeitaCelestial(baseUrl: string, page: number) {
  const url =
    page === 1 ? `${baseUrl}/comics` : `${baseUrl}/comics/?page=${page}`;
  console.log(`Buscando Seita Celestial: ${url}`);

  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        Referer: baseUrl,
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-User": "?1",
      },
      cache: "no-store",
      signal: controller.signal,
    });

    if (!res.ok) {
      console.log(res);
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

    $("a[href*='/comics/']").each((_, el) => {
      const href = $(el).attr("href");
      const title = $(el).attr("title") || $(el).find(".tt").text().trim();
      const img = $(el).find("img").attr("src") || "";
      const chapter =
        $(el)
          .find(".epxs")
          .text()
          .replace(/[^0-9]/g, "") || "";
      const description = ""; // O site não exibe descrição na listagem

      // Remover a parte base da URL
      const mangaUrl = href?.replace(baseUrl, "") || "";

      if (title === "") return;

      mangas.push({
        title,
        img,
        chapters: chapter,
        url: cleanMangaId(mangaUrl),
        description,
      });
    });

    return mangas;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        console.error("Requisição abortada por timeout.");
      } else {
        console.error("Erro ao buscar mangas:", error.message);
      }
    } else {
      console.error("Erro desconhecido:", error);
    }
  } finally {
    clearTimeout(timeoutId);
  }
}
