"use server";

import { API_URL } from "@/services/baseURL";
import { getToken } from "@/services/token/takeToken";

export const unfavoriteManga = async (
  data: {
    url: string;
  },
  sourceId: string
) => {
  "use server";
  const response = await fetch(`${API_URL}/mangas/unfavorite/${sourceId}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${await getToken()}`,
    },
    body: JSON.stringify(data),
  });

  return response.ok;
};
