"use server";

import { load } from "cheerio";
const controller = new AbortController();

function cleanMangaId(mangaId: string): string {
  return mangaId.replace(/^\/|\/$/g, "");
}

export async function fetchMangasMangaLivre(page: number, url: string) {
  console.log(`Tentando buscar: ${page === 1 ? url : `${url}/page/${page}/`}`);

  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(`${page === 1 ? url : `${url}/page/${page}/`}`, {
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

    $(".manga__item").each((_, element) => {
      const title = $(element).find(".post-title h2 a").text().trim();
      const img = $(element).find(".manga__thumb_item img").attr("src") || "";
      // Correção aqui: usando o seletor correto para o último capítulo e extraindo apenas o número
      const chapterText = $(element)
        .find(".list-chapter .chapter-item")
        .first()
        .find(".chapter a")
        .text()
        .trim();

      const rawUrl = $(element).find(".manga__thumb_item a").attr("href") || "";
      const mangaUrl = rawUrl.replace(`${url}/manga`, "");

      // Extrair apenas o número do capítulo
      const chapters = chapterText.replace(/[^0-9]/g, "");

      const description = $(element).find(".manga-excerpt p").text().trim();

      mangas.push({
        title,
        img,
        chapters,
        url: cleanMangaId(mangaUrl),
        description,
      });
    });

    return mangas;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        console.error("A requisição foi abortada por timeout.");
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
