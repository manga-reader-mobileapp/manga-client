"use client";

import logout from "@/api/logout";
import BottomMenu from "@/components/menu/bottomMenu";
import { useRouter } from "next/navigation";
import { HiOutlineLogout } from "react-icons/hi";
import { MdLabelOutline } from "react-icons/md";

export default function MorePage() {
  const { push, replace } = useRouter();

  const menu = [
    {
      label: "Categorias",
      action: async () => {
        push("/reader/more/categories");
      },
      icon: MdLabelOutline,
    },
    // {
    //   label: "Perfil ",
    //   action: async () => {
    //     push("/reader/more/profile");
    //   },
    //   icon: TiUserOutline,
    // },
    {
      label: "Logout",
      action: async () => {
        await logout();
        replace("/");
      },
      icon: HiOutlineLogout,
    },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-neutral-900 text-white w-full">
      {/* Header fixo */}
      <div className="pt-4 px-5 sm:px-4 md:px-16 lg:px-72 xl:px-96 py-4 flex items-center justify-between shrink-0">
        <h1 className="text-2xl">Configurações</h1>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-4 px-4 sm:px-4 md:px-16 lg:px-72 xl:px-96 py-4 bg-neutral-900 pb-6 h-full">
        {menu.map(({ label, action, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center justify-between p-3 rounded-xl cursor-pointer hover:bg-neutral-600"
            onClick={action}
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
