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
  ShopOutlined,
  TeamOutlined,
  UnorderedListOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { Button, ConfigProvider, Layout, Menu, Table, Input, Spin, Tooltip, theme } from "antd";
import { LogOut } from "lucide-react";
import style from "./MainLayout.module.scss";
import DropdownMenu from "../DropdownMenu/DropdownMenu";
import { useHeaderStore } from "../../../../store/headerStore";
import { useLiveQuery } from "dexie-react-hooks";
import { useLogout } from "@/hook/useAuth";
import { db } from "@/db/db";
import { useRouter } from "next/navigation";
import { protectedRoutes, isRole } from "@/helper/ProtectedRoutes";


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
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const setLogin = useHeaderStore((state) => state.setLogin);
  const login = useHeaderStore((state) => state.login);
  const GetMeData = useLiveQuery(() => db.getMe.toCollection().first(), []);

  const { push } = useRouter();
  const { mutate: logout } = useLogout();

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
        // onClick: () => push("/i"),
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

    // Фильтруем по ролям
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

  return (
    <Layout style={{ minHeight: "100vh", background: "#678098" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="dark"
        className={style.sider}
        style={{
          transition: "width 0.3s ease",
          overflow: "hidden",
          background: "#678098",
          height: "100vh", // Устанавливаем высоту на 100vh
          overflowY: "auto", // Добавляем прокрутку при необходимости
        }}
      >
        <ConfigProvider
          theme={{
            components: {
              Menu: {
                itemSelectedColor: "#fff",
                itemSelectedBg: "#ffffff4f",
                itemHoverBg: "#ffffff4f", // Цвет при hover
                itemActiveBg: "#678098", // Цвет при активном состоянии
                itemColor: "#fff", // Цвет текста
                itemHoverColor: "#fff", // Цвет текста при hover
              },
            },
          }}
        >
          <Menu
            // theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={menuItems}
            style={{
              maxHeight: "100vh",
              overflowY: "auto",
              background: "#678098",
            }}
          />
        </ConfigProvider>
      </Sider>
      <Layout style={{ background: "#fff" }}>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            lineHeight: "0",
          }}
          className={style.header}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />

          <div className={style.headerBellAndButtons}>
            <DropdownMenu />
            <div className={style.headerButtons}>
              <ConfigProvider
                theme={{
                  components: {
                    Button: {
                      colorPrimaryBorderHover: "red",
                      colorPrimaryHover: "#678098",
                      colorPrimary: "#678098",
                      colorPrimaryActive: "#678098",
                      colorPrimaryTextHover: "#678098",
                    },
                  },
                }}
              >
                <Button
                  icon={<p>{login[0].toUpperCase()}</p>}
                  className={style.headerLoginChar}
                />
              </ConfigProvider>

              <p className={style.headerLogin}>{login}</p>
              <Tooltip title="Выход">
                <LogOut
                  size={32}
                  color="#fff"
                  cursor="pointer"
                  onClick={() => logout()}
                />
              </Tooltip>
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: "calc(100vh - 64px)", // Вычитаем высоту хедера (64px)
            background: "#fff",
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