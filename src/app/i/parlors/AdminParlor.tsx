'use client';

import { Button } from "antd";
import { Toaster } from "sonner";
import ParlorTable from "./ParlorTable";
import ParlorModal from "./ParlorModal";
import { useState } from "react";
import { useParlorData } from "@/hook/parlorHook";
import { BookFilled, PlusOutlined } from "@ant-design/icons";

export default function AdminParlor() {
  const { parlorData } = useParlorData();
  const [type, setType] = useState<"Добавить" | "Изменить">("Добавить");
  const [parlorId, setParlorId] = useState<number>();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isArchive,setIsArchive] = useState<boolean>(false)


  const onAdd = () => {
    setParlorId(undefined);
    setType("Добавить");
    setIsModalOpen(true);
  };

  const onEdit = (id: number) => {
    setParlorId(id);
    setType("Изменить");
    setIsModalOpen(true);
  };

  return (
    <div>
      <Toaster />
      <ParlorModal
        type={type}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        parlorId={parlorId}
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
      <ParlorTable parlorData={parlorData} onEdit={onEdit} isArchive={isArchive}/>
    </div>
  );
}
