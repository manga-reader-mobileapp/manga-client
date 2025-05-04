"use server";
import { API_URL } from "@/services/baseURL";

export async function createAccount(
  email: string,
  password: string,
  name: string
) {
  const response = await fetch(`${API_URL}/users/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email?.toLowerCase(),
      password: password,
      name,
    }),
  });

  return response.ok;
}
