import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Lexend } from "next/font/google";
import "./globals.css";

const lexend = Lexend({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MangaYomi",
  description: "Leitor de mangás online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lexend.className} antialiased`}>
        {children}
        <Toaster position="top-right" richColors expand={false} />
      </body>
    </html>
  );
}
