"use server";

import { load } from "cheerio";

export async function fetchPagesFromSeitaCelestial(chapterUrl: string) {
  try {
    const res = await fetch(chapterUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        Referer: "https://seitacelestial.com/",
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
      throw new Error(`Erro ao buscar capítulo: ${res.status}`);
    }

    const html = await res.text();
    const $ = load(html);

    // Adicionar log para depuração do HTML carregado
    const chapterImages: {
      imageUrl: string;
      pageNumber: number;
    }[] = [];
    const scriptData = $("script").html(); // Pega o conteúdo de todos os <script> tags
    console.log(scriptData);

    // Tente encontrar as imagens com a classe correta
    $(".ts-main-image").each((index, element) => {
      const imageUrl = $(element).attr("src")?.trim() || "";

      // Verificar se a URL não está vazia antes de adicionar
      if (imageUrl) {
        chapterImages.push({
          imageUrl,
          pageNumber: index + 1, // Começa em 1
        });
      }
    });

    if (chapterImages.length === 0) {
      console.log("Nenhuma imagem encontrada com a classe '.ts-main-image'");
    }

    return {
      totalPages: chapterImages.length,
      images: chapterImages,
    };
  } catch (error) {
    console.error("Erro ao buscar imagens do capítulo:", error);
    return {
      totalPages: 0,
      images: [],
    };
  }
}
