"use server";
import { API_URL } from "@/services/baseURL";
import { crypt } from "@/services/crypt";
import { cookies } from "next/headers";

export async function authLogin(email: string, password: string) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email?.toLowerCase(),
        password: password,
      }),
    });

    const data = await response.json();

    if (!data.acess_token) {
      return {
        message: data.message,
      };
    }

    const cookieStore = await cookies();

    const crypted = await crypt(data.acess_token);

    cookieStore.set("access_token", crypted, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return data;
  } catch (err: any) {
    const msm = err?.message ?? "Erro desconhecido";

    console.log(msm);

    if (msm && msm !== "") {
      return msm;
    }

    return "";
  }
}
