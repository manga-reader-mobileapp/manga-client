"use client";

import BottomMenu from "@/components/menu/bottomMenu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function BrowsePage() {
  const { push } = useRouter();

  return (
    <div className="flex flex-col h-screen overflow-hidden gap-5 bg-neutral-900 text-white w-full">
      {/* Header fixo */}
      <div className="pt-4 px-5 flex items-center justify-between shrink-0">
        <h1 className="text-2xl">Browse</h1>
      </div>

      {/* <div className="px-5">
        <Input placeholder="Pesquisar origens" disabled />
      </div> */}

      <div className="h-full flex flex-col gap-3 px-5">
        <div className="flex w-full items-center gap-4 justify-between">
          <div className="flex items-center gap-4">
            <img
              src={
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRC8wm15JUceez7HgLUXccZsyYpp-_s8Txew&s"
              }
              alt="img"
              className="w-12 h-12 object-cover rounded-2xl"
            />

            <p>Mangás</p>
          </div>
          <Button
            variant="ghost"
            className="cursor-pointer"
            onClick={() => {
              push("/reader/browse/get");
            }}
          >
            Recentes
          </Button>
        </div>
      </div>

      {/* BottomMenu fixo */}
      <BottomMenu />
    </div>
  );
}
