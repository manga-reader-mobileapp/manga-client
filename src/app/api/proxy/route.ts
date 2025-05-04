import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const imageUrl = req.nextUrl.searchParams.get("url");
  if (!imageUrl) return new NextResponse("URL obrigatória", { status: 400 });

  try {
    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Referer: "https://lermangas.me",
      },
    });

    if (!response.ok) {
      return new NextResponse("Erro ao buscar imagem", {
        status: response.status,
      });
    }

    const contentType = response.headers.get("Content-Type") || "image/jpeg";
    const arrayBuffer = await response.arrayBuffer();

    return new NextResponse(Buffer.from(arrayBuffer), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.log(error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}
