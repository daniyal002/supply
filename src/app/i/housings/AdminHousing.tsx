'use client';

import { Button } from "antd";
import { Toaster } from "sonner";
import HousingTable from "./HousingTable";
import HousingModal from "./HousingModal";
import { useState } from "react";
import { useHousingData } from "@/hook/housingHook";
import { BookFilled, PlusOutlined } from "@ant-design/icons";

export default function AdminHousing() {
  const { housingsData } = useHousingData();
  const [type, setType] = useState<"Добавить" | "Изменить">("Добавить");
  const [housingId, setHousingId] = useState<number>();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isArchive,setIsArchive] = useState<boolean>(false)


  const onAdd = () => {
    setHousingId(undefined);
    setType("Добавить");
    setIsModalOpen(true);
  };

  const onEdit = (id: number) => {
    setHousingId(id);
    setType("Изменить");
    setIsModalOpen(true);
  };

  return (
    <div>
      <Toaster />
      <HousingModal
        type={type}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        housingId={housingId}
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
      <HousingTable housingsData={housingsData} onEdit={onEdit} isArchive={isArchive}/>
    </div>
  );
}
