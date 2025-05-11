"use client";

import BottomMenu from "@/components/menu/bottomMenu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { IoSearch } from "react-icons/io5";

const scans = [
  {
    name: "manga-livre",
    label: "Manga livre",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRC8wm15JUceez7HgLUXccZsyYpp-_s8Txew&s",
  },
  {
    name: "seita-celestial",
    label: "Seita Celestial",
    img: "https://seitacelestial.com/wp-content/uploads/2024/08/logo-extended.png",
  },
  {
    name: "br-mangas",
    label: "Br Mangas",
    img: "https://pbs.twimg.com/profile_images/1623827589289635841/a0bQg3zQ_400x400.jpg",
  },
  {
    name: "manga-dex",
    label: "MangaDex",
    img: "https://www.svgrepo.com/show/331479/mangadex-v2.svg",
  },
];

export default function BrowsePage() {
  const { push } = useRouter();

  return (
    <div className="flex flex-col h-screen overflow-hidden gap-5 bg-neutral-900 text-white w-full">
      {/* Header fixo */}
      <div className="pt-4 px-5 flex items-center justify-between shrink-0">
        <h1 className="text-2xl">Browse</h1>

        <IoSearch
          size={24}
          onClick={() => push("/reader/browse/search")}
          className="cursor-pointer"
        />
      </div>

      <div className="h-full flex flex-col gap-5 px-5">
        {scans.map((scan, i) => (
          <div
            className="flex w-full items-center gap-4 justify-between"
            key={i}
          >
            <div className="flex items-center gap-4">
              <img
                src={scan.img}
                alt="img"
                className="w-12 h-12 object-cover rounded-2xl"
              />

              <p>{scan.label}</p>
            </div>
            <Button
              variant="ghost"
              className="cursor-pointer"
              onClick={() => {
                push(`/reader/browse/${scan.name}`);
              }}
            >
              Recentes
            </Button>
          </div>
        ))}
      </div>

      {/* BottomMenu fixo */}
      <BottomMenu />
    </div>
  );
}
