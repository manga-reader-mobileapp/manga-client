"use server";

import { API_URL } from "@/services/baseURL";
import { getToken } from "@/services/token/takeToken";

export const updateLastChapter = async (
  mangaId: string,
  data: { chapter: string }
) => {
  "use server";

  const response = await fetch(`${API_URL}/mangas/last-chapter/${mangaId}`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${await getToken()}`,
    },
    body: JSON.stringify(data),
  });

  return response.ok;
};
