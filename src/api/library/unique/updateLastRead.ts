"use server";

import { API_URL } from "@/services/baseURL";
import { getToken } from "@/services/token/takeToken";

export const updateLastRead = async (
  mangaId: string,
  data: { chapter: string; forceUpdate?: boolean }
) => {
  "use server";

  const response = await fetch(
    `${API_URL}/mangas/update-last-read/${mangaId}`,
    {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${await getToken()}`,
      },
      body: JSON.stringify(data),
    }
  );

  return response.ok;
};
