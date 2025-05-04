"use server";

import { API_URL } from "@/services/baseURL";
import { getToken } from "@/services/token/takeToken";

export const updateOrderCategory = async (
  data: { id: string; newPosition: number }[]
) => {
  "use server";

  const response = await fetch(`${API_URL}/category/modify-order`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${await getToken()}`,
    },
    body: JSON.stringify(data),
  });

  return response.ok;
};
