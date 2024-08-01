import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryClientContextProvider from "./QueryClientContextProvider";
import { AntdRegistry } from "@ant-design/nextjs-registry";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Снабжение",
  description: "Снабженай свой центр",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <AntdRegistry>
        <QueryClientContextProvider>
          <body className={inter.className}>{children}</body>
        </QueryClientContextProvider>
      </AntdRegistry>
    </html>
  );
}
