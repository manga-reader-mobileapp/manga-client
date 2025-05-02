"use server";

import { API_URL } from "@/services/baseURL";
import { getToken } from "@/services/token/takeToken";

export const getListCategory = async () => {
  "use server";

  const response = await fetch(`${API_URL}/category/`, {
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
