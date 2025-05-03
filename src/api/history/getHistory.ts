"use server";

import { API_URL } from "@/services/baseURL";
import { getToken } from "@/services/token/takeToken";

export const getAllHistory = async () => {
  "use server";

  const response = await fetch(`${API_URL}/mangas/all/history`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${await getToken()}`,
    },
  });

  if (response && response.ok) {
    const data = await response.json();

    return data;
  }

  return;
};
