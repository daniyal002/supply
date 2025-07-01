"use client";

import { Button } from "antd";
import { Toaster } from "sonner";
import UserModal from "./UserModal";
import { useState } from "react";
import { useUserData } from "@/hook/userHook";
import UserTable from "./UserTable";
import { BookFilled, PlusOutlined } from "@ant-design/icons";

export default function AdminUser() {
  const { userData } = useUserData();
  const [type, setType] = useState<"Добавить" | "Изменить">("Добавить");
  const [userId, setUserId] = useState<number>();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isArchive,setIsArchive] = useState<boolean>(false)


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
      <div style={{display:'flex', gap:'10px'}}>
      <Button
        type="primary"
        shape="circle"
        icon={<PlusOutlined />}
        onClick={onAdd}
        style={{ marginBottom: "10px" }}
      />
      <Button
        type="primary"
        shape="circle"
        icon={<BookFilled />}
        onClick={() => setIsArchive(!isArchive)}
        style={{ marginBottom: "10px", color: isArchive ? '' : '#fff', backgroundColor: isArchive ? "" : 'gray' }}
      />
      </div>
      <UserTable userData={userData} onEdit={onEdit} isArchive={isArchive}/>
    </div>
  );
}
