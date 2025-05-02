"use client";

import BottomMenu from "@/components/menu/bottomMenu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const browseOrigins = [
  {
    id: "1",
    title: "Manga livre",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRC8wm15JUceez7HgLUXccZsyYpp-_s8Txew&s",
    link: "manga-livre",
  },
];

export default function BrowsePage() {
  const { push } = useRouter();

  return (
    <div className="flex flex-col h-screen overflow-hidden gap-5 bg-neutral-900 text-white w-full">
      {/* Header fixo */}
      <div className="pt-4 px-5 flex items-center justify-between shrink-0">
        <h1 className="text-2xl">Browse</h1>
      </div>

      <div className="px-5">
        <Input placeholder="Pesquisar origens" disabled />
      </div>

      <div className="h-full flex flex-col gap-3 px-5">
        {browseOrigins.map((origin, i) => (
          <div
            className="flex w-full items-center gap-4 justify-between"
            key={i}
          >
            <div className="flex items-center gap-4">
              <img
                src={origin.img}
                alt="img"
                className="w-12 h-12 object-cover rounded-2xl"
              />

              <p>{origin.title}</p>
            </div>
            <Button
              variant="ghost"
              className="cursor-pointer"
              onClick={() => {
                push("/reader/browse/" + origin.link);
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
