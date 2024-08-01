'use client';

import { Button } from "antd";
import { Toaster } from "sonner";
import HousingTable from "./HousingTable";
import HousingModal from "./HousingModal";
import { useState } from "react";
import { useHousingData } from "@/hook/housingHook";

export default function AdminHousing() {
  const { housingsData } = useHousingData();
  const [type, setType] = useState<"Добавить" | "Изменить">("Добавить");
  const [housingId, setHousingId] = useState<number>();

  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <Button onClick={onAdd}>Добавить корпус</Button>
      <HousingTable housingsData={housingsData} onEdit={onEdit} />
    </div>
  );
}
