import React from "react";
import type { MenuProps } from "antd";
import { Button, Dropdown, Space } from "antd";
import { useLogout } from "@/hook/useAuth";
import { LogOut, RefreshCcw } from "lucide-react";
import { deleteGetMe } from "@/db/db";
import { userService } from "@/services/user.service";

interface Props {
  supplyTheme: string;
  isMobile: boolean;
}

const LogoutDropdown = ({ isMobile, supplyTheme }: Props) => {
  const { mutate: logout } = useLogout();

  const updateProfile = async () => {
    deleteGetMe();
    await userService.getMe();
    window.location.reload();
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div style={{display:"flex",flexDirection:'column', gap:"10px"}}>
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
          title="Выход"
        >
          {!isMobile ? "Выход" : ""}
        </Button>
        <Button
        icon={
          <RefreshCcw
            size={20}
            color={supplyTheme === "light" ? "#678098" : "#fff"}
            cursor="pointer"
          />
        }
        onClick={() => updateProfile()}
        iconPosition="end"
        title="Обновить"
      >
        {!isMobile ? "Обновить" : ""}
      </Button>
      </div>
      ),
    },
  ];

  return (
    <Dropdown menu={{ items }} placement="bottomCenter">
      <Button
        icon={
          <LogOut
            size={20}
            color={supplyTheme === "light" ? "#678098" : "#fff"}
            cursor="pointer"
          />
        }
        iconPosition="end"
      >
        {!isMobile ? "Выход" : ""}
      </Button>
    </Dropdown>
  );
};

export default LogoutDropdown;
