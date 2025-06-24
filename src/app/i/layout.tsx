import type { Metadata } from "next";
import AdminPanel from "./AdminPanel";
import styles from './layout.module.scss'
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
      <AdminPanel />
      <div className={styles.adminContent}>{children}</div>
    </div>
  );
}