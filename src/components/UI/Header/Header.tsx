"use client";
import { Container, EllipsisVertical, LogOut, Menu } from "lucide-react";
import style from "./Header.module.scss";
import Link from "next/link";
import { useGetMe } from "@/hook/userHook";
import { useEffect, useState } from "react";
import { useHeaderStore } from "../../../../store/headerStore";
import { usePathname } from "next/navigation";
import { useLogout } from "@/hook/useAuth";
export default function Header() {
  const setLogin = useHeaderStore((state) => state.setLogin);
  const login = useHeaderStore((state) => state.login);
  const editCollapsed = useHeaderStore((state) => state.editCollapsed);
  const collapsed = useHeaderStore((state) => state.collapsed);
  const { GetMeData } = useGetMe();
  const pathname = usePathname();
  useEffect(() => {
    if (GetMeData) {
      setLogin(GetMeData?.login);
    }
  }, [GetMeData]);

  const {mutate:logout} = useLogout()
 

  if (pathname === "/login") {
    return null;
  }
  return (
    <div className={style.header}>
      <div className={style.headerlogo}>
        <div className={style.headerlogoContainer}>
          <Container size={40} color="#fff" />
          <Link href="/">
            {" "}
            <h1 className={style.headerLogoText}>Снабжение</h1>
          </Link>
        </div>
        <Menu
          size={20}
          color="#678098"
          onClick={() => editCollapsed(!collapsed)}
        />
      </div>

      <div className={style.headerButtons}>
        <p className={style.headerLoginChar}>{login[0]}</p>
        <p className={style.headerLogin}>{login}</p>
        <LogOut size={32} color="#fff" cursor="pointer" onClick={() => logout()}/>
      </div>
    </div>
  );
}
