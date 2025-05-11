"use server";

import { API_URL } from "@/services/baseURL";
import { getToken } from "@/services/token/takeToken";

export const favoriteManga = async (
  data: {
    title: string;
    description: string;
    img: string;
    url: string;
    chapters: string;
  },
  sourceId: string
) => {
  "use server";

  const response = await fetch(`${API_URL}/mangas/favorite/${sourceId}`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${await getToken()}`,
    },
    body: JSON.stringify(data),
  });

  return response.ok;
};
