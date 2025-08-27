import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import QueryClientContextProvider from "./QueryClientContextProvider";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import MainLayout from "@/components/UI/MainLayout/MainLayout";
import AntdConfigProvider from "./AntdConfigProvider";
import Beforeunload from "@/components/Beforeunload/Beforeunload";
import BroadcastModal from "./i/brodcast/BroadcastModal";

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
        <AntdConfigProvider>
          <Beforeunload>
          <body className={inter.className}>
            <MainLayout>
              <BroadcastModal/>
            {children}
            </MainLayout>
          </body>
          </Beforeunload>
            </AntdConfigProvider>
        </QueryClientContextProvider>
      </AntdRegistry>
    </html>
  );
}
