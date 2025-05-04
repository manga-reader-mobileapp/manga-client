"use server";

import { API_URL } from "@/services/baseURL";
import { getToken } from "@/services/token/takeToken";

export const updateMangaCategory = async (data: {
  mangaId: string[];
  categoryId: string;
}) => {
  "use server";

  const response = await fetch(`${API_URL}/mangas/update-category`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${await getToken()}`,
    },
    body: JSON.stringify(data),
  });

  return response.ok;
};
