'use client';

import { Button } from "antd";
import { Toaster } from "sonner";
import PostTable from "./RoleTable";
import RoleModal from "./RoleModal";
import { useState } from "react";
import { useRoleData } from "@/hook/roleHook";

export default function AdminRole() {
  const { roleData } = useRoleData();
  const [type, setType] = useState<"Добавить" | "Изменить">("Добавить");
  const [roleId, setRoleId] = useState<number>();

  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <Button onClick={onAdd}>Добавить роль</Button>
      <PostTable roleData={roleData} onEdit={onEdit} />
    </div>
  );
}
