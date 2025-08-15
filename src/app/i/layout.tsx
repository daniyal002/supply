import Bredcrump from "@/components/UI/Bredcrump/Bredcrump";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Админ-панель",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div style={{display:'flex', flexDirection:"column", gap:"10px"}}>
        <Bredcrump/>
        {children}</div>
  );
}