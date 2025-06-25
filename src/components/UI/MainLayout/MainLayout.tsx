"use client";

import React, { useEffect, useState } from "react";
import {
  BookOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, ConfigProvider, Layout, Menu, theme } from "antd";
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
  onClick: () => void;
};

const MainLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [collapsed, setCollapsed] = useState(false);
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
        onClick: () => push("/i"),
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
    <ConfigProvider>
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
          <ConfigProvider
            theme={{
              components: {
                Menu: {
                  itemSelectedColor: "#fff",
                  itemSelectedBg: "#678098",
                },
              },
            }}
          >
            <Menu
              theme="light"
              mode="inline"
              defaultSelectedKeys={["1"]}
              items={menuItems}
              style={{ maxHeight: "100vh", overflowY: "auto" }}
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
                <Button
                  icon={<p>{login[0].toUpperCase()}</p>}
                  className={style.headerLoginChar}
                />
                <p className={style.headerLogin}>{login}</p>
                <LogOut
                  size={32}
                  color="#fff"
                  cursor="pointer"
                  onClick={() => logout()}
                />
              </div>
            </div>
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background: "#fff",
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default MainLayout;
