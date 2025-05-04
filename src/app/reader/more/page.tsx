"use client";

import BottomMenu from "@/components/menu/bottomMenu";
import { useRouter } from "next/navigation";
import { MdLabelOutline } from "react-icons/md";

const menu = [
  {
    label: "Categorias",
    path: "/reader/more/categories",
    icon: MdLabelOutline,
  },
];

export default function MorePage() {
  const { push } = useRouter();

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-neutral-900 text-white w-full">
      {/* Header fixo */}
      <div className="pt-4 px-5 flex items-center justify-between shrink-0">
        <h1 className="text-2xl">Configurações</h1>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-4 px-4 sm:px-4 md:px-16 lg:px-72 xl:px-96 py-4 bg-neutral-900 pb-6 h-full">
        {menu.map(({ label, path, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center justify-between p-3 rounded-xl cursor-pointer hover:bg-neutral-600"
            onClick={() => push(path)}
          >
            <div className="flex items-center gap-4">
              <Icon size={20} />
              <p className="text-sm">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* BottomMenu fixo */}
      <BottomMenu />
    </div>
  );
}
