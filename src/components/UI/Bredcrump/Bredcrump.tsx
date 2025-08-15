"use client";

import { Breadcrumb } from "antd";
import { usePathname } from "next/navigation";
import React from "react";
import { AdminPanelList } from "../MainLayout/AdminPanelList";

// Вспомогательная функция: получает заголовок по pathname
const getTitleByPathname = (pathname: string) => {
  // Создаём список с push = пустая функция, т.к. нужен только label
  const items = AdminPanelList(() => {});

  const found = items.find((item) => item.onClick.toString().includes(pathname));
  return found?.label || null;
};

export default function Bredcrump() {
  const pathname = usePathname();

  const title = getTitleByPathname(pathname);

  const breadcrumbItems = [
    {
      title: "Админ-панель",
    },
  ];

  // Добавляем текущую страницу, если она из админ-панели
  if (title) {
    breadcrumbItems.push({ title });
  }

  return <Breadcrumb items={breadcrumbItems} />;
}