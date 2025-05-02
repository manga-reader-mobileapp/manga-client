"use client";

type MangaCardProps = {
  title: string;
  img: string;
  chapters?: string;
};

export default function MangaCard({ title, img, chapters }: MangaCardProps) {
  return (
    <div className="w-[110px] h-[190px] m-2 rounded-lg overflow-hidden bg-[#1E1E1E]">
      <div className="relative w-full h-[150px]">
        <img
          src={img}
          alt={title}
          className="w-full h-full object-cover rounded-t-lg"
        />
        {chapters && (
          <div className="absolute top-1 left-1 bg-blue-500/80 px-2 py-0.5 rounded-full">
            <span className="text-white text-xs font-bold">{chapters}</span>
          </div>
        )}
      </div>
      <div className="px-2 py-1 h-[40px] flex items-center justify-center">
        <p className="text-white text-xs text-center line-clamp-2">{title}</p>
      </div>
    </div>
  );
}
