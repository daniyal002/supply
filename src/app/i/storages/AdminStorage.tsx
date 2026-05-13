"use client";

import { Button } from "antd";
import { Toaster } from "sonner";
import { useState } from "react";
import { BookFilled, PlusOutlined } from "@ant-design/icons";

import { useStorageData } from "@/hook/storageHook";
import StorageModal from "./StorageModal";
import StorageTable from "./StorageTable";

export default function AdminStorage() {
  const { storageData, refetch } = useStorageData();

  const [type, setType] = useState<"Добавить" | "Изменить">("Добавить");
  const [storageId, setStorageId] = useState<number>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isArchive, setIsArchive] = useState<boolean>(false);

  const onAdd = () => {
    setStorageId(undefined);
    setType("Добавить");
    setIsModalOpen(true);
  };

  const onEdit = (id: number) => {
    setStorageId(id);
    setType("Изменить");
    setIsModalOpen(true);
  };

  return (
    <div>
      <Toaster />

      <StorageModal
        type={type}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        storageId={storageId}
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

      <StorageTable
        storageData={storageData}
        onEdit={onEdit}
        isArchive={isArchive}
        refetch={refetch}
      />
    </div>
  );
}