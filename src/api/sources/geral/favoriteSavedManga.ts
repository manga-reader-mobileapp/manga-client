"use server";

import { API_URL } from "@/services/baseURL";
import { getToken } from "@/services/token/takeToken";

export const favoriteSavedManga = async (mangaId: string) => {
  "use server";
  const response = await fetch(`${API_URL}/mangas/favorite-saved/${mangaId}`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${await getToken()}`,
    },
  });

  return response.ok;
};
