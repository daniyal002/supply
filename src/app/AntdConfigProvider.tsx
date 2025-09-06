"use client";

import { ConfigProvider } from "antd";
import locale from "antd/locale/ru_RU";
import { useThemeStore } from "../../store/themeStore";
import { darkTheme, lightTheme } from "@/theme/supplyTheme";
import { useEffect, useState } from "react";

export default function AntdConfigProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { supplyTheme, setSupplyTheme } = useThemeStore();


  // useEffect(() => {
  //   // Обновите тему на основе системных настроек
  //   const isDarkMode = window.matchMedia(
  //     "(prefers-color-scheme: dark)"
  //   ).matches;
  //   setSupplyTheme(isDarkMode ? "dark" : "light");

  //   // Добавьте слушатель изменений системной темы
  //   const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  //   const handleChange = (e: MediaQueryListEvent) => {
  //     setSupplyTheme(e.matches ? "dark" : "light");
  //   };
  //   mediaQuery.addEventListener("change", handleChange);
  //   return () => mediaQuery.removeEventListener("change", handleChange);
  // }, [setSupplyTheme]);


  return (
    <ConfigProvider locale={locale} theme={supplyTheme === "light" ? lightTheme : darkTheme}>
      {children}
    </ConfigProvider>
  );
}
