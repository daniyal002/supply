import type { Metadata } from "next";
import { ConfigProvider } from "antd";
export const metadata: Metadata = {
  title: "Админ-панель",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#678098",
        },
      }}
    >
      <div>{children}</div>
      </ConfigProvider>
  );
}