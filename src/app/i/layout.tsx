import type { Metadata } from "next";
import AdminPanel from "./AdminPanel";
import styles from './layout.module.scss'
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
    <div className={styles.adminLayout}>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#678098",
        },
      }}
    >
      {/* <AdminPanel /> */}
      <div className={styles.adminContent}>{children}</div>
      </ConfigProvider>
    </div>
  );
}