"use client";
import { Container, EllipsisVertical, LogOut, Menu } from "lucide-react";
import style from "./Header.module.scss";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useHeaderStore } from "../../../../store/headerStore";
import { usePathname } from "next/navigation";
import { useLogout } from "@/hook/useAuth";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db/db";
export default function Header() {
  const setLogin = useHeaderStore((state) => state.setLogin);
  const login = useHeaderStore((state) => state.login);
  const editCollapsed = useHeaderStore((state) => state.editCollapsed);
  const collapsed = useHeaderStore((state) => state.collapsed);
  const GetMeData = useLiveQuery(() => db.getMe.toCollection().first(), []);

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
          <Link href="/" className={style.headerlogoContainer}>
            <Container size={40} color="#fff" />
            <h1 className={style.headerLogoText}>Снабжение</h1>
          </Link>
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
