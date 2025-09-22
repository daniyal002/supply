"use client";

import { Button } from "antd";
import { Toaster } from "sonner";
import RoleTable from "./RoleTable";
import RoleModal from "./RoleModal";
import { useState } from "react";
import { useRoleData } from "@/hook/roleHook";
import { BookFilled, PlusOutlined } from "@ant-design/icons";

export default function AdminRole() {
  const { roleData, refetch } = useRoleData();
  const [type, setType] = useState<"Добавить" | "Изменить">("Добавить");
  const [roleId, setRoleId] = useState<number>();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isArchive, setIsArchive] = useState<boolean>(false);

  const onAdd = () => {
    setRoleId(undefined);
    setType("Добавить");
    setIsModalOpen(true);
  };

  const onEdit = (id: number) => {
    setRoleId(id);
    setType("Изменить");
    setIsModalOpen(true);
  };

  return (
    <div>
      <Toaster />
      <RoleModal
        type={type}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        roleId={roleId}
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
      <RoleTable
        roleData={roleData}
        onEdit={onEdit}
        isArchive={isArchive}
        refetch={refetch}
      />
    </div>
  );
}
