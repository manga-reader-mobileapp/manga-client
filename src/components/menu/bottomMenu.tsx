"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiBookOpen,
  FiClock,
  FiCompass,
  FiMoreHorizontal,
} from "react-icons/fi";
import { twMerge } from "tailwind-merge";

const menuItems = [
  { label: "Library", path: "/reader/library", icon: FiBookOpen },
  { label: "History", path: "/reader/history", icon: FiClock },
  { label: "Browse", path: "/reader/browse", icon: FiCompass },
  { label: "More", path: "/reader/more", icon: FiMoreHorizontal },
];

export default function BottomMenu() {
  const pathname = usePathname();

  return (
    <nav className="bg-[#140B1C] border-t border-neutral-800 flex justify-around py-2">
      {menuItems.map(({ label, path, icon: Icon }) => {
        const active = pathname === path;
        return (
          <Link
            key={label}
            href={path}
            className="group flex flex-col items-center text-xs"
          >
            <div
              className={twMerge(
                "relative w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-150 cursor-pointer",
                active
                  ? "bg-purple-500 text-white"
                  : "text-neutral-400 hover:bg-[#2A1836]"
              )}
            >
              <Icon size={20} />
              {/* {badge && (
                <span className="absolute top-0 right-0 text-[10px] bg-rose-200 text-black font-bold px-1.5 py-0.5 rounded-full leading-none transform translate-x-1/2 -translate-y-1/2">
                  {badge}
                </span>
              )} */}
            </div>
            <span
              className={twMerge(
                "mt-1 transition-colors duration-150",
                active
                  ? "text-white font-semibold"
                  : "text-neutral-400 group-hover:text-white"
              )}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
