'use client';

import { Button } from "antd";
import { Toaster } from "sonner";
import ParlorTable from "./ParlorTable";
import ParlorModal from "./ParlorModal";
import { useState } from "react";
import { useParlorData } from "@/hook/parlorHook";

export default function AdminParlor() {
  const { parlorData } = useParlorData();
  const [type, setType] = useState<"Добавить" | "Изменить">("Добавить");
  const [parlorId, setParlorId] = useState<number>();

  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <Button onClick={onAdd}>Добавить кабинет</Button>
      <ParlorTable parlorData={parlorData} onEdit={onEdit} />
    </div>
  );
}
