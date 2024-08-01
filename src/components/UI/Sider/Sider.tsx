"use client";

import { Layout, Menu } from "antd";
import { useHeaderStore } from "../../../../store/headerStore";
import { UnorderedListOutlined, UserOutlined } from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";

const { Sider } = Layout;

const SiderL: React.FC = () => {
  const pathname = usePathname();

  const collapsed = useHeaderStore((state) => state.collapsed);
  const { push } = useRouter();
  if (pathname === "/login") {
    return null;
  }
  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={{
        height: "100%",
        background: "#fff",
        boxShadow: "-4px 10px 15px 0.5px black",
      }}
    >
      <div className="demo-logo-vertical" />
      <Menu
        theme="light"
        mode="inline"
        defaultSelectedKeys={["1"]}
        items={[
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
        ]}
      />
    </Sider>
  );
};

export default SiderL;