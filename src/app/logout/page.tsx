"use client";

import logout from "@/api/logout";
import { useEffect } from "react";

export default function Logout() {
  const handleLogout = async () => {
    await logout();
    window.location.href = "/reader/login";
  };

  useEffect(() => {
    handleLogout();
  }, []);

  return (
    <div className="flex h-screen items-center justify-center">
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-md"
      >
        Logout
      </button>
    </div>
  );
}
