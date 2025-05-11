"use server";

export async function fetchMangasMangaDex(page: number = 1, baseUrl: string) {
  const limit = 20;
  const offset = (page - 1) * limit;

  const url = `${baseUrl}/manga?limit=${limit}&offset=${offset}&availableTranslatedLanguage[]=pt-br&order[latestUploadedChapter]=desc&includes[]=cover_art`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Erro ao buscar mangas: ${res.status}`);
    }

    const data = await res.json();

    const mangas = data.data.map((item: any) => {
      const attributes = item.attributes;

      const title =
        attributes.title["pt-br"] ||
        attributes.altTitles.find((t: any) => t["pt-br"])?.["pt-br"] ||
        attributes.title["en"] ||
        "Título desconhecido";

      const description =
        attributes.description["pt-br"] ||
        attributes.description["en"] ||
        "Sem descrição disponível.";

      const coverArt = item.relationships.find(
        (rel: any) => rel.type === "cover_art"
      );

      const coverUrl = coverArt
        ? `https://uploads.mangadex.org/covers/${item.id}/${coverArt.attributes.fileName}.256.jpg`
        : "";

      return {
        title,
        img: coverUrl,
        chapters: "0",
        url: item.id,
        description,
      };
    });

    return mangas;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erro ao buscar mangas:", error.message);
    } else {
      console.error("Erro desconhecido:", error);
    }
  }
}
