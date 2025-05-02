"use client";
import { User } from "@/type/types";
import { create } from "zustand";
import {
  createJSONStorage,
  devtools,
  persist,
  StateStorage,
} from "zustand/middleware";

let storage: StateStorage;

if (typeof window !== "undefined") {
  const { del, get, set } = require("idb-keyval");

  storage = {
    getItem: async (name: string): Promise<string | null> => {
      return (await get(name)) || null;
    },
    setItem: async (name: string, value: string): Promise<void> => {
      await set(name, value);
    },
    removeItem: async (name: string): Promise<void> => {
      await del(name);
    },
  };
} else {
  storage = {
    getItem: async () => null,
    setItem: async () => {},
    removeItem: async () => {},
  };
}

interface State {
  user: User;
  setUser: (_: User) => void;
}

export const useStore = create<State>()(
  devtools(
    persist(
      (set) => ({
        user: {} as User,
        setUser: (a: User) =>
          set((prev) => ({ ...prev, user: { ...prev.user, ...a } })),
      }),
      {
        name: "store-manga",
        storage: createJSONStorage(() => storage),
      }
    )
  )
);
