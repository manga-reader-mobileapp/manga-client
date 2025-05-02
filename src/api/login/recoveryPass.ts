"use server";
import { API_URL } from "@/services/baseURL";

export async function recoverPass(password: string, recoveryLink: string) {
  "use server";

  const res = await fetch(`${API_URL}/auth/recovery-password/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${recoveryLink}`,
    },
    body: JSON.stringify({
      password,
    }),
  });

  return res.ok;
}
