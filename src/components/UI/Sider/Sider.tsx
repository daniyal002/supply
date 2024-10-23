"use client";

import { Layout, Menu } from "antd";
import { useHeaderStore } from "../../../../store/headerStore";
import { InboxOutlined, UnorderedListOutlined, UserOutlined } from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import { isRole, protectedRoutes } from "@/helper/ProtectedRoutes";
import { useEffect, useState } from "react";
import style from "./Sider.module.scss"
import { icons } from "lucide-react";

const { Sider } = Layout;

interface MenuItem {
  key: string;
  icon: JSX.Element;
  label: string;
  onClick: () => void;
}

const SiderL: React.FC = () => {
  const pathname = usePathname();

  const collapsed = useHeaderStore((state) => state.collapsed);
  const login = useHeaderStore((state) => state.login);
  const { push } = useRouter();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const role = isRole();
    const items = [
      {
        key: "1",
        icon: <UnorderedListOutlined />,
        label: "Заявки",
        onClick: () => {
          push("/");
        },
      },
      {
        key: "2",
        icon: <UserOutlined />,
        label: "Админ-панель",
        onClick: () => {
          push("/i");
        },
      },
      {
        key:'3',
        icon:<InboxOutlined />,
        label: "Согласования",
        onClick: () => {
          push("/approval");
        }
      }

    ];

    const protectedItems = items.filter(item =>
      protectedRoutes.some(protectedI =>
        (protectedI.key === item.key && protectedI.role.includes(role)) || protectedI.key !== item.key
      )
    );

    setMenuItems(protectedItems);
  }, [push,login]);

  if (pathname === "/login") {
    return null;
  }
  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={{
        boxShadow: "-4px 10px 15px 0.5px black",
      }}
      className={!collapsed ? ` ${style.siderActive} ${style.sider}` : `${style.sider}`}
    >
      <div className="demo-logo-vertical" />
      <Menu
        theme="light"
        mode="inline"
        defaultSelectedKeys={["1"]}
        items={menuItems}
      />
    </Sider>
  );
};

export default SiderL;
