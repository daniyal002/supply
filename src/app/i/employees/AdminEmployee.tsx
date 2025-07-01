'use client';

import { Button } from "antd";
import { Toaster } from "sonner";
import EmployeeModal from "./EmployeeModal";
import { useState } from "react";
import { useEmployeeData } from "@/hook/employeeHook";
import EmployeeTable from "./EmployeeTable";
import { BookFilled, PlusOutlined } from "@ant-design/icons";

export default function AdminEmployee() {
  const { employeeData } = useEmployeeData();
  const [type, setType] = useState<"Добавить" | "Изменить">("Добавить");
  const [employeeId, setEmployeeId] = useState<number>();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isArchive,setIsArchive] = useState<boolean>(false)


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
      <EmployeeTable employeeData={employeeData} onEdit={onEdit} isArchive={isArchive}/>
    </div>
  );
}
