'use client';

import { usePostData } from "@/hook/postHook";
import { Button } from "antd";
import { Toaster } from "sonner";
import RouteTable from "./RouteTable";
import { useState } from "react";
import { IOrderRouteRequest } from "@/interface/orderRoute";
import Link from "next/link";
import { useOrderRouteData } from "@/hook/orderRouterHook";
import { PlusOutlined } from "@ant-design/icons";

export default function AdminRoute() {

  const { orderRouteData } = useOrderRouteData();
  const [type, setType] = useState<"Добавить" | "Изменить">("Добавить");
  const [postId, setPostId] = useState<number>();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const onAdd = () => {
    setPostId(undefined);
    setType("Добавить");
    setIsModalOpen(true);
  };

  const onEdit = (id: number) => {
    setPostId(id);
    setType("Изменить");
    setIsModalOpen(true);
  };

  return (
    <div>
      <Toaster />

      <Link href="routes/newRoute"><Button
        type="primary"
        shape="circle"
        icon={<PlusOutlined />}
        onClick={onAdd}
        style={{ marginBottom: "10px" }}
      /></Link>


      <RouteTable routeData={orderRouteData} onEdit={onEdit} />
    </div>
  );
}
