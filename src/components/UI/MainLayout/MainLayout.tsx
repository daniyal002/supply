"use client";

import React, { useEffect, useState } from "react";
import {
  ApartmentOutlined,
  BookOutlined,
  CalculatorOutlined,
  CompassOutlined,
  HomeOutlined,
  IdcardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  QuestionCircleOutlined,
  ShopOutlined,
  SunOutlined,
  TagsOutlined,
  TeamOutlined,
  UnorderedListOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, Tooltip, message, theme } from "antd";
import { LogOut } from "lucide-react";
import style from "./MainLayout.module.scss";
import DropdownMenu from "../DropdownMenu/DropdownMenu";
import { useHeaderStore } from "../../../../store/headerStore";
import { useLiveQuery } from "dexie-react-hooks";
import { useLogout } from "@/hook/useAuth";
import { db } from "@/db/db";
import { usePathname, useRouter } from "next/navigation";
import { protectedRoutes, isRole } from "@/helper/ProtectedRoutes";
import { useThemeStore } from "../../../../store/themeStore";

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
  const { mutate: logout } = useLogout();
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
        children: [
          {
            key: "4",
            label: "Пользователи",
            icon: <UserOutlined />,
            onClick: () => push("/i/users"),
          },
          {
            key: "5",
            label: "Роли",
            icon: <TeamOutlined />,
            onClick: () => push("/i/roles"),
          },
          {
            key: "6",
            label: "Сотрудники",
            icon: <IdcardOutlined />,
            onClick: () => push("/i/employees"),
          },
          {
            key: "7",
            label: "Кабинеты",
            icon: <HomeOutlined />,
            onClick: () => push("/i/parlors"),
          },
          {
            key: "8",
            label: "Подразделения",
            icon: <ApartmentOutlined />,
            onClick: () => push("/i/departments"),
          },
          {
            key: "9",
            label: "Корпуса",
            icon: <ShopOutlined />,
            onClick: () => push("/i/housings"),
          },
          {
            key: "10",
            label: "Должности",
            icon: <UserSwitchOutlined />,
            onClick: () => push("/i/posts"),
          },
          {
            key: "11",
            label: "Маршруты",
            icon: <CompassOutlined />,
            onClick: () => push("/i/routes"),
          },
          {
            key: "12",
            label: "Статусы заявок",
            icon: <TagsOutlined />,
            onClick: () => push("/i/orderStatus"),
          },
          {
            key: "13",
            label: "1C",
            icon: <CalculatorOutlined />,
            onClick: () => push("/i/oneC"),
          },
        ],
      },
      {
        key: "3",
        icon: <BookOutlined />,
        label: "Все заявки",
        onClick: () => push("/adminOrder"),
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

  const editTheme = () => {
    supplyTheme === "light" ? setSupplyTheme("dark") : setSupplyTheme("light");
  };

  if (path === "/login") {
    return <>{children}</>;
  }

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
          display: isMobile ? (isMobileMenuOpen ? "block" : "none") : "block",
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
        <Header
          style={{
            padding: 0,
            lineHeight: "0",
          }}
          className={style.header}
        >
          <Button
            type="link"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleCollapsed}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />

          <div className={style.headerBellAndButtons}>
            <Tooltip title={"Техподдержка"}>
              <Button
                onClick={() =>
                  message.info(
                    "Для связи с техподдержкой позвоните по внутренному телефону на 194 или 195"
                  )
                }
                size={isMobile ? "small" : "middle"}
              >
                {isMobile ? <QuestionCircleOutlined /> : "Техподдержка"}
              </Button>
            </Tooltip>

            <Tooltip
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
            </Tooltip>

            <DropdownMenu />

            <div
              className={style.headerButtons}
              style={{ backgroundColor: LayoutToken?.siderBg }}
            >
              <Tooltip title={login}>
                <Button
                  icon={<p>{login[0].toUpperCase()}</p>}
                  className={style.headerLoginChar}
                  onClick={() => message.info(`Ваш логин: ${login}`)}
                  size={isMobile ? "small" : "middle"}
                />
              </Tooltip>
              <Tooltip title="Выход">
                <Button
                  icon={
                    <LogOut
                      size={20}
                      color={supplyTheme === "light" ? "#678098" : "#fff"}
                      cursor="pointer"
                    />
                  }
                  onClick={() => logout()}
                  iconPosition="end"
                >
                  Выход
                </Button>
              </Tooltip>
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
