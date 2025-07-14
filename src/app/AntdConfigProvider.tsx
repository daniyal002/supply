'use client'

import { ConfigProvider } from "antd";
import locale from "antd/locale/ru_RU";
import { useThemeStore } from "../../store/themeStore";
import { darkTheme, lightTheme } from "@/theme/supplyTheme";

export default function AntdConfigProvider({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {

const { supplyTheme } = useThemeStore();
// Выберите тему в зависимости от состояния
const currentTheme = supplyTheme === 'light' ? lightTheme : darkTheme;
    return(


<ConfigProvider
        locale={locale}
          theme={currentTheme}
        >
            {children}
        </ConfigProvider>
    )
  }