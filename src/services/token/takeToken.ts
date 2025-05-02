"use server";

import { cookies } from "next/headers";
import { decrypt } from "../crypt";

export const getToken = async () => {
  const cookieStore = await cookies();
  const data = cookieStore.get("access_token");

  if (data?.value) {
    return decrypt(data.value);
  }

  return {
    token: null,
  };
};
