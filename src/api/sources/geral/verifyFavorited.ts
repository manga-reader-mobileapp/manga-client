"use server";

import { API_URL } from "@/services/baseURL";
import { getToken } from "@/services/token/takeToken";

export const verifyFavorited = async (url: string, sourceId: string) => {
  "use server";
  const response = await fetch(`${API_URL}/mangas/favorited/${sourceId}`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${await getToken()}`,
    },
    body: JSON.stringify({ url }),
  });

  if (response && response.ok) {
    const data = await response.json();

    return data;
  }

  return;
};
