import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import QueryClientContextProvider from "./QueryClientContextProvider";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import Header from "@/components/UI/Header/Header";
import SiderL from "@/components/UI/Sider/Sider";
import style from "./layout.module.scss"
import MainLayout from "@/components/UI/MainLayout/MainLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Снабжение",
  description: "Снабжанай свой центр",
  icons: {
    icon: "./favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <link rel="icon" href="./favicon.ico" />
      </head>
      <AntdRegistry>
        <QueryClientContextProvider>
          <body className={inter.className}>
            {/* <Header />
            <div  className={style.layout}>
            <SiderL />
            <main className="main">
            </main>
            </div> */}
            <MainLayout>
            {children}
            </MainLayout>
          </body>
        </QueryClientContextProvider>
      </AntdRegistry>
    </html>
  );
}
