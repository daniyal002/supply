'use client';

import { Button } from "antd";
import { Toaster } from "sonner";
import DepartmentTable from "./DepartmentTable";
import DepartmentModal from "./DepartmentModal";
import { useState } from "react";
import { useDepartmentData } from "@/hook/departmentHook";

export default function AdminDepartment() {
  const { departmentData } = useDepartmentData();
  const [type, setType] = useState<"Добавить" | "Изменить">("Добавить");
  const [departmentId, setDepartmentId] = useState<number>();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const onAdd = () => {
    setDepartmentId(undefined);
    setType("Добавить");
    setIsModalOpen(true);
  };

  const onEdit = (id: number) => {
    setDepartmentId(id);
    setType("Изменить");
    setIsModalOpen(true);
  };

  return (
    <div>
      <Toaster />
      <DepartmentModal
        type={type}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        departmentId={departmentId}
      />
      <Button onClick={onAdd}>Добавить подразделение</Button>
      <DepartmentTable departmentData={departmentData} onEdit={onEdit} />
    </div>
  );
}
