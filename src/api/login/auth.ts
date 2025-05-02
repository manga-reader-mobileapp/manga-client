"use server";
import { API_URL } from "@/services/baseURL";
import { crypt } from "@/services/crypt";
import { cookies } from "next/headers";

export async function authLogin(email: string, password: string) {
  "use server";

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email?.toLocaleLowerCase(),
        password: password,
      }),
    });

    const data = await response.json();

    if (data.user.instanceDisable) {
      return {
        instanceDisable: true,
      };
    }

    cookies().set("access_token", crypt(data.acess_token), {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 dias
    });

    return data;
  } catch (err: any) {
    const msm = err.response?.data.message;

    if (msm && msm != "") {
      return msm;
    }

    return "";
  }
}
