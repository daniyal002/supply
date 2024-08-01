"use client";

import { usePathname, useRouter } from "next/navigation";
import style from "./AdminPanel.module.scss";

export default function AdminPanel() {
  const { push } = useRouter();
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  return (
      <div className={style.adminButtons}>
        <button
          onClick={() => push("/i/users")}
          className={
            isActive("/i/users")
              ? `${style.adminButton} ${style.active}`
              : style.adminButton
          }
        >
          Пользователи
        </button>
        <button
          onClick={() => push("/i/roles")}
          className={
            isActive("/i/roles")
              ? `${style.adminButton} ${style.active}`
              : style.adminButton
          }
        >
          Роли
        </button>
        <button
          onClick={() => push("/i/employees")}
          className={
            isActive("/i/employees")
              ? `${style.adminButton} ${style.active}`
              : style.adminButton
          }
        >
          Сотрудники
        </button>
        <button
          onClick={() => push("/i/parlors")}
          className={
            isActive("/i/parlors")
              ? `${style.adminButton} ${style.active}`
              : style.adminButton
          }
        >
          Кабинеты
        </button>
        <button
          onClick={() => push("/i/departments")}
          className={
            isActive("/i/departments")
              ? `${style.adminButton} ${style.active}`
              : style.adminButton
          }
        >
          Подразделение
        </button>
        <button
          onClick={() => push("/i/housings")}
          className={
            isActive("/i/housings")
              ? `${style.adminButton} ${style.active}`
              : style.adminButton
          }
        >
          Корпуса
        </button>
        <button
          onClick={() => push("/i/posts")}
          className={
            isActive("/i/posts")
              ? `${style.adminButton} ${style.active}`
              : style.adminButton
          }
        >
          Должности
        </button>
      </div>
  );
}
