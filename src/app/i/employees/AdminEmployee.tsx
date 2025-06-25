'use client';

import { Button } from "antd";
import { Toaster } from "sonner";
import EmployeeModal from "./EmployeeModal";
import { useState } from "react";
import { useEmployeeData } from "@/hook/employeeHook";
import EmployeeTable from "./EmployeeTable";
import { PlusOutlined } from "@ant-design/icons";

export default function AdminEmployee() {
  const { employeeData } = useEmployeeData();
  const [type, setType] = useState<"Добавить" | "Изменить">("Добавить");
  const [employeeId, setEmployeeId] = useState<number>();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const onAdd = () => {
    setEmployeeId(undefined);
    setType("Добавить");
    setIsModalOpen(true);
  };

  const onEdit = (id: number) => {
    setEmployeeId(id);
    setType("Изменить");
    setIsModalOpen(true);
  };

  return (
    <div>
      <Toaster />
      <EmployeeModal
        type={type}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        employeeId={employeeId}
      />
      <Button
        type="primary"
        shape="circle"
        icon={<PlusOutlined />}
        onClick={onAdd}
        style={{ marginBottom: "10px" }}
      />
      <EmployeeTable employeeData={employeeData} onEdit={onEdit} />
    </div>
  );
}
