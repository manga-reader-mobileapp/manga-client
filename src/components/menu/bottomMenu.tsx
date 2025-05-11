"use client";

import { useEffect, useState } from "react";
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
  const [position, setPosition] = useState<"top" | "bottom">("bottom");

  useEffect(() => {
    const savedPosition = localStorage.getItem("menuPosition");
    if (savedPosition === "top" || savedPosition === "bottom") {
      setPosition(savedPosition);
    }
  }, []);

  return (
    <nav
      className={twMerge(
        "bg-[#140B1C] border-neutral-800 flex justify-around py-2 z-50 w-full",
        position === "top"
          ? "border-b fixed top-0 mb-4"
          : "border-t fixed bottom-0"
      )}
    >
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
