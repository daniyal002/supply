'use client';

import { Button } from "antd";
import { Toaster } from "sonner";
import OrderStatusTable from "./OrderStatusTable";
import OrderStatusModal from "./OrderStatusModal";
import { useState } from "react";
import { BookFilled, PlusOutlined } from "@ant-design/icons";
import { useGetOrderStatus } from "@/hook/orderStatusHook";

export default function AdminOrderStatus() {
  const { orderStatusData } = useGetOrderStatus();
  const [type, setType] = useState<"Добавить" | "Изменить">("Добавить");
  const [orderStatusId, setOrderStatusId] = useState<number>();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isArchive,setIsArchive] = useState<boolean>(false)


  const onAdd = () => {
    setOrderStatusId(undefined);
    setType("Добавить");
    setIsModalOpen(true);
  };

  const onEdit = (id: number) => {
    setOrderStatusId(id);
    setType("Изменить");
    setIsModalOpen(true);
  };

  return (
    <div>
      <Toaster />
      <OrderStatusModal
        type={type}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        OrderStatusId={orderStatusId}
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
      <OrderStatusTable orderStatusData={orderStatusData} onEdit={onEdit} isArchive={isArchive} />
    </div>
  );
}
