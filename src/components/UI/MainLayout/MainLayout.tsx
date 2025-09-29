"use client";

import React, { useEffect, useState } from "react";
import {
  BookOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  QuestionCircleOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, Tooltip, message, theme } from "antd";
import { Waypoints } from "lucide-react";
import style from "./MainLayout.module.scss";
import DropdownNotifications from "../DropdownMenu/DropdownNotifications";
import { useHeaderStore } from "../../../../store/headerStore";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db/db";
import { usePathname, useRouter } from "next/navigation";
import { protectedRoutes, isRole } from "@/helper/ProtectedRoutes";
import { useThemeStore } from "../../../../store/themeStore";
import { AdminPanelList } from "./AdminPanelList";
import LogoutDropdown from "./LogoutDropdown";
import DropdownNotificationsChat from "../DropdownMenu/DropdownNotificationsChat";
import { p } from "framer-motion/client";
import NewsTicker from "@/components/NewsTicker/NewsTicker";

const { Header, Sider, Content } = Layout;

type MenuItem = {
  key: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  children?: MenuItem[];
};

const MainLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [collapsed, setCollapsed] = useState(true);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  const {
    token: { borderRadiusLG, Layout: LayoutToken },
  } = theme.useToken();

  const setLogin = useHeaderStore((state) => state.setLogin);
  const login = useHeaderStore((state) => state.login);
  const GetMeData = useLiveQuery(() => db.getMe.toCollection().first(), []);

  const { push } = useRouter();
  const path = usePathname();

  // Получаем роль из токена
  const userRole = isRole();

  // Формируем элементы меню
  useEffect(() => {
    const items = [
      {
        key: "1",
        icon: <UnorderedListOutlined />,
        label: "Заявки",
        onClick: () => push("/"),
      },
      {
        key: "2",
        icon: <UserOutlined />,
        label: "Админ-панель",
        children: AdminPanelList(push),
      },
      {
        key: "3",
        icon: <BookOutlined />,
        label: "Все заявки",
        onClick: () => push("/adminOrder"),
      },
      {
        key: "14",
        icon: <QuestionCircleOutlined  />,
        label: "Руководство пользования",
        onClick: () => push("/help"),
      },
    ];

    const filteredItems = items.filter((item) =>
      protectedRoutes.some(
        (route) =>
          route.key === item.key && route.role.includes(userRole as string)
      )
    );

    setMenuItems(filteredItems);
  }, [userRole, push]);

  useEffect(() => {
    if (GetMeData) {
      setLogin(GetMeData?.login);
    }
  }, [GetMeData]);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMobileMenuOpen(false); // Сброс при изменении размера экрана
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleCollapsed = () => {
    if (isMobile) {
      setMobileMenuOpen(!isMobileMenuOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const { setSupplyTheme, supplyTheme } = useThemeStore();

  // const editTheme = () => {
  //   supplyTheme === "light" ? setSupplyTheme("dark") : setSupplyTheme("light");
  // };

  if (path === "/login") {
    return <>{children}</>;
  }

  const latestNews = `🔥 Теперь из 1С возвращаются статусы заявок в зависимости от их состояния; 🔥 Через кнопку «Помощь» доступны видеоинструкции по работе с программой; 🔥 Нажмите на кнопку «${login[0].toUpperCase()}» рядом с «Выход», чтобы перейти в свой профиль`;

  return (
    <Layout
      style={{ minHeight: "100vh", backgroundColor: LayoutToken?.headerBg }}
    >
      <Sider
        trigger={null}
        collapsible={!isMobile}
        collapsed={isMobile ? !isMobileMenuOpen : collapsed}
        className={style.sider}
        style={{
          position: isMobile ? "fixed" : "relative",
          zIndex: isMobile ? 1000 : "auto",
          width: isMobile ? 250 : undefined,
          height: isMobile ? "100vh" : undefined,
          top: 0,
          left: 0,
          transition: "all 0.3s ease",
          overflowY: "auto",
          // display: isMobile ? (isMobileMenuOpen ? "block" : "none") : "block",
          display:
            menuItems.length === 0
              ? "none"
              : isMobile
              ? isMobileMenuOpen
                ? "block"
                : "none"
              : "block",
        }}
      >
        <Menu
          mode="inline"
          theme="light"
          defaultSelectedKeys={["1"]}
          items={menuItems}
          style={{
            maxHeight: "100vh",
            overflowY: "auto",
          }}
        />
      </Sider>

      {/* Overlay для мобильных */}
      {isMobile && isMobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 999,
          }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <Layout style={{ background: LayoutToken?.headerBg }}>
      <NewsTicker news={latestNews} speed={65} />
        <Header
          style={{
            padding: 0,
            lineHeight: "0",
          }}
          className={style.header}
        >
          <Button
            type="link"
            icon={
              menuItems.length === 0 ? (
                <Waypoints
                  size={25}
                  color={supplyTheme === "light" ? "#678098" : "#fff"}
                />
              ) : collapsed ? (
                <MenuUnfoldOutlined />
              ) : (
                <MenuFoldOutlined />
              )
            }
            onClick={menuItems.length === 0 ? undefined : toggleCollapsed}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />

          <div className={style.headerBellAndButtons}>
            <Tooltip title={"Помощь"}>
              <Button onClick={() => push("/help")} size={isMobile ? "small" : "middle"}>{isMobile ? <QuestionCircleOutlined /> : "Помощь"}</Button>
            </Tooltip>

            {/* <Tooltip
              title={
                supplyTheme === "light"
                  ? "Сменить на темную тему"
                  : "Сменить на светлую тему"
              }
            >
              <Button
                onClick={() => editTheme()}
                size={isMobile ? "small" : "middle"}
              >
                {supplyTheme === "light" ? <SunOutlined /> : <MoonOutlined />}
              </Button>
            </Tooltip> */}

            <DropdownNotifications />
            <DropdownNotificationsChat />

            <div
              className={style.headerButtons}
              style={{ backgroundColor: LayoutToken?.siderBg }}
            >
              <Tooltip title={login}>
                <Button
                  icon={<p>{login[0].toUpperCase()}</p>}
                  className={style.headerLoginChar}
                  onClick={() => push("/profile")}
                  size={isMobile ? "small" : "middle"}
                />
              </Tooltip>
              <LogoutDropdown isMobile={isMobile} supplyTheme={supplyTheme} />
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: "15px",
            minHeight: "calc(100vh - 64px)",
            background: LayoutToken?.headerBg,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
