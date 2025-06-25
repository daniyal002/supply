"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import style from "./AdminPanel.module.scss";
import { ApartmentOutlined, CalculatorOutlined, CompassOutlined, HomeOutlined, IdcardOutlined, MenuFoldOutlined, MenuUnfoldOutlined, ShopOutlined, TeamOutlined, UserOutlined, UserSwitchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

const menuItems = [
  { path: "/i/users", label: "Пользователи", icon: <UserOutlined /> },
  { path: "/i/roles", label: "Роли", icon: <TeamOutlined /> },
  { path: "/i/employees", label: "Сотрудники", icon: <IdcardOutlined /> },
  { path: "/i/parlors", label: "Кабинеты", icon: <HomeOutlined /> },
  { path: "/i/departments", label: "Подразделения", icon: <ApartmentOutlined /> },
  { path: "/i/housings", label: "Корпуса", icon: <ShopOutlined /> },
  { path: "/i/posts", label: "Должности", icon: <UserSwitchOutlined /> },
  { path: "/i/routes", label: "Маршруты", icon: <CompassOutlined /> },
  { path: "/i/oneC", label: "1C", icon: <CalculatorOutlined /> },
];

export default function AdminPanel() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Определяем, мобильное ли устройство
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setCollapsed(true); // Сворачиваем по умолчанию на мобильных
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <aside className={`${style.sidebar} ${collapsed ? style.collapsed : ""}`}>
      {/* Кнопка сворачивания */}
      <button className={style.toggleBtn} onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </button>
      <nav className={style.menu}>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`${style.menuItem} ${pathname === item.path ? style.active : ""}`}
          >
            <span className={style.icon}>{item.icon}</span>
            {!collapsed && <span className={style.label}>{item.label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}