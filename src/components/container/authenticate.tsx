"use server";
import logout from "@/api/logout";
import { API_URL } from "@/services/baseURL";
import { getToken } from "@/services/token/takeToken";
import { redirect } from "next/navigation";

export default async function Authenticated({
  children,
}: {
  children: React.ReactNode;
}) {
  async function getUser() {
    const tokenJWT = await getToken();

    if (tokenJWT) {
      const res = await fetch(`${API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${tokenJWT}`,
        },
        next: {
          revalidate: 250000,
        },
      });

      if (res.status !== 201 && res.status !== 200) {
        await logout();
        redirect("/");
        return;
      } else {
        const data = await res.json();
        return data;
      } // TODO Consertar o validação user
    }
  }

  const user = await getUser();

  if (!user) {
    await logout();
    redirect("/");
  }

  return (
    <main className="flex h-screen max-h-screen bg-white-back1">
      {children}
    </main>
  );
}
