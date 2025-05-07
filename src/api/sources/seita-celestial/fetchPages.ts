"use server";

import { Pages } from "@/type/types";

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
      throw new Error(`Erro ao buscar capítulo: ${res.status}`);
    }

    const html = await res.text();

    // Procurar pelo padrão específico do script ts_reader.run
    const scriptRegex = /ts_reader\.run\(([\s\S]*?)\);/;

    const match = html.match(scriptRegex);

    if (!match || !match[1]) {
      throw new Error("Não foi possível encontrar dados do script ts_reader");
    }

    // Extrair o JSON do script
    const jsonData = JSON.parse(match[1]);

    // Extrair os links das imagens
    const chapterImages: Pages[] = [];
    if (jsonData.sources && jsonData.sources.length > 0) {
      const images = jsonData.sources[0].images || [];

      images.forEach((imageUrl: string | undefined, index: number) => {
        if (imageUrl) {
          chapterImages.push({
            imageUrl,
            pageNumber: index + 1, // Começa em 1
          });
        }
      });
    }

    return {
      totalPages: chapterImages.length,
      images: chapterImages,
      prevUrl: jsonData.prevUrl || null,
      nextUrl: jsonData.nextUrl || null,
    };
  } catch (error) {
    console.error("Erro ao buscar imagens do capítulo:", error);
    return;
  }
}
