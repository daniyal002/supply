'use client';

import { usePostData } from "@/hook/postHook";
import { Button } from "antd";
import { Toaster } from "sonner";
import PostTable from "./RouteTable";
import { useState } from "react";
import { IOrderRouteRequest } from "@/interface/orderRoute";
import Link from "next/link";

export default function AdminPost() {
  const orderRoutes: IOrderRouteRequest[] = [
    {
        route_id: 1,
        route_name: "Маршрут 1",
        department_id: 101
    },
    {
        route_id: 2,
        route_name: "Маршрут 2",
        department_id: 102
    },
    {
        route_id: 3,
        route_name: "Маршрут 3",
        department_id: 103
    }
];

  const { postData } = usePostData();
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

      <Link href="routes/newRoute">Добавить Маршрут</Link>
      <PostTable routeData={orderRoutes} onEdit={onEdit} />
    </div>
  );
}
