"use server";

import { API_URL } from "@/services/baseURL";
import { getToken } from "@/services/token/takeToken";

export const deleteCategory = async (id: string) => {
  "use server";

  const response = await fetch(`${API_URL}/category/${id}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${await getToken()}`,
    },
  });

  return response.ok;
};
