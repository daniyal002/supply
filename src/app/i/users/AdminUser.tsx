"use client";

import { Button } from "antd";
import { Toaster } from "sonner";
import UserModal from "./UserModal";
import { use, useMemo, useState } from "react";
import { useUserData } from "@/hook/userHook";
import UserTable from "./UserTable";
import { BookFilled, PlusOutlined } from "@ant-design/icons";
import { useConnectedUsersData } from "@/hook/notificationHook";
import { IUserOnline } from "@/interface/user";
import ModalSendMessage from "@/components/UI/ModalSendMessage/ModalSendMessage";

export default function AdminUser() {
  const { userData,refetch } = useUserData();
  const { connectedUsersData } = useConnectedUsersData();
  const [type, setType] = useState<"Добавить" | "Изменить">("Добавить");
  const [userId, setUserId] = useState<number>();
  const [buyerId, setBuyerId] = useState<number>();


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalMessageOpen, setIsModalMessageOpen] = useState(false);

  const [isArchive, setIsArchive] = useState<boolean>(false);

  const filteredIsOnlineUsers: IUserOnline[] = useMemo(() => {
    if (connectedUsersData) {
      return userData?.map((user) => {
        const isOnline = connectedUsersData.some(
          (connUser) => connUser.buyer_id === user.employee.buyer_id
        );
        const connected_at = connectedUsersData.find(
          (connUser) => connUser.buyer_id === user.employee.buyer_id
        )?.connected_at;
        return {
          ...user,
          is_online: isOnline,
          connected_at: isOnline ? (connected_at as string) : "",
        };
      }) as IUserOnline[];
    } else {
      return userData as IUserOnline[];
    }
  }, [userData, connectedUsersData]);

  const onAdd = () => {
    setUserId(undefined);
    setType("Добавить");
    setIsModalOpen(true);
  };

  const onEdit = (id: number) => {
    setUserId(id);
    setType("Изменить");
    setIsModalOpen(true);
  };

  return (
    <div>
      <Toaster />
      <UserModal
        type={type}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        userId={userId}
      />
      <ModalSendMessage
        isModalOpen={isModalMessageOpen}
        setIsModalOpen={setIsModalMessageOpen}
        buyerId={String(buyerId)}
      />
      <div style={{ display: "flex", gap: "10px" }}>
        <Button
          type="primary"
          shape="circle"
          icon={<PlusOutlined />}
          onClick={onAdd}
          style={{ marginBottom: "10px" }}
          title="Добавить"
        />
        <Button
          type="primary"
          shape="circle"
          icon={<BookFilled />}
          onClick={() => setIsArchive(!isArchive)}
          style={{
            marginBottom: "10px",
            color: isArchive ? "" : "#fff",
            backgroundColor: isArchive ? "" : "gray",
          }}
          title={isArchive ? "Не архивные" : "Архивные"}
        />
      </div>
      <UserTable
        userData={filteredIsOnlineUsers}
        onEdit={onEdit}
        isArchive={isArchive}
        setBuyerId={setBuyerId}
        setIsModalMessageOpen={setIsModalMessageOpen}
        refetch={refetch}
      />
    </div>
  );
}
