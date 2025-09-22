'use client';

import { Button } from "antd";
import { Toaster } from "sonner";
import DepartmentTable from "./DepartmentTable";
import DepartmentModal from "./DepartmentModal";
import { useState } from "react";
import { useDepartmentData } from "@/hook/departmentHook";
import { BookFilled, PlusOutlined } from "@ant-design/icons";

export default function AdminDepartment() {
  const { departmentData, refetch } = useDepartmentData();
  const [type, setType] = useState<"Добавить" | "Изменить">("Добавить");
  const [departmentId, setDepartmentId] = useState<number>();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [isArchive,setIsArchive] = useState<boolean>(false)

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
      <div style={{display:'flex', gap:'10px'}}>
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
        style={{ marginBottom: "10px", color: isArchive ? '' : '#fff', backgroundColor: isArchive ? "" : 'gray' }}
        title={isArchive ? 'Не архивные' : 'Архивные'}
      />
      </div>
      <DepartmentTable departmentData={departmentData} onEdit={onEdit} isArchive={isArchive} refetch={refetch}/>
    </div>
  );
}
