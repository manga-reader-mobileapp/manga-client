"use client";

type MangaCardProps = {
  title: string;
  img: string;
  chapters?: string;
  onClick?: () => void;
};

export default function MangaCard({
  title,
  img,
  chapters,
  onClick,
}: MangaCardProps) {
  return (
    <div
      className="w-[110px] h-[165px] m-1 rounded overflow-hidden relative cursor-pointer group"
      onClick={onClick}
    >
      {/* Imagem com efeito de escurecer no hover */}
      <img
        src={img || "/images/noimage.png"}
        alt={title}
        className="w-full h-full object-cover transition-all duration-200 group-hover:brightness-75"
      />

      {/* Overlay escuro para hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200"></div>

      {/* Badge de capítulos */}
      {chapters && (
        <div className="absolute top-1 left-1 bg-pink-500 px-1.5 py-0.5 rounded-full">
          <span className="text-white text-[10px] font-bold">{chapters}</span>
        </div>
      )}

      {/* Sobreposição do título na parte inferior */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-1.5 py-1">
        <p className="text-white text-[11px] font-semibold leading-tight line-clamp-2">
          {title}
        </p>
      </div>
    </div>
  );
}
