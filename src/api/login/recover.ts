"use server";
import { API_URL } from "@/services/baseURL";

export async function recover(email: string) {
  "use server";

  const res = await fetch(`${API_URL}/auth/recovery/${email}`, {
    method: "POST",
  });

  return res.ok;
}
