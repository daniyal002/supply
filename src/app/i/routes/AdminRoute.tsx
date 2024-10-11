'use client';

import { usePostData } from "@/hook/postHook";
import { Button } from "antd";
import { Toaster } from "sonner";
import RouteTable from "./RouteTable";
import { useState } from "react";
import { IOrderRouteRequest } from "@/interface/orderRoute";
import Link from "next/link";
import { useOrderRouteData } from "@/hook/orderRouterHook";

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

      <Link href="routes/newRoute">Добавить Маршрут</Link>
      <RouteTable routeData={orderRouteData?.detail} onEdit={onEdit} />
    </div>
  );
}
