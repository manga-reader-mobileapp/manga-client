"use server";

export async function searchMangasMangaDex(
  baseUrl: string,
  query: string,
  page: number = 1
) {
  const limit = 20;
  const offset = (page - 1) * limit;

  const url = `${baseUrl}/manga?title=${encodeURIComponent(
    query
  )}&limit=${limit}&offset=${offset}&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&includes[]=cover_art&order[relevance]=desc`;

  try {
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      throw new Error(`Erro ao buscar mangás no MangaDex: ${res.status}`);
    }

    const data = await res.json();

    const mangas: {
      title: string;
      img: string;
      chapters: string;
      url: string;
      description: string;
    }[] = [];

    data.data.map((manga: any) => {
      if (
        !manga.attributes.availableTranslatedLanguages.find(
          (t: string) => t === "pt-br"
        )
      )
        return null;

      const title =
        manga.attributes.title["pt-br"] ||
        manga.attributes.altTitles.find((t: any) => t["pt-br"])?.["pt-br"] ||
        manga.attributes.title["en"] ||
        "Título desconhecido";

      const description =
        manga.attributes.description["pt-br"] ||
        manga.attributes.description["en"] ||
        "Sem descrição disponível.";

      const coverArt = manga.relationships.find(
        (rel: any) => rel.type === "cover_art"
      );
      const fileName = coverArt?.attributes?.fileName;
      const img = fileName
        ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.256.jpg`
        : "";

      const url = manga.id;

      mangas.push({
        title,
        description,
        img,
        url,
        chapters: "0",
      });
    });

    return mangas;
  } catch (error) {
    console.error("Erro ao buscar mangás MangaDex:", error);
    return null;
  }
}
