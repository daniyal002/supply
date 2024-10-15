'use client';

import { IPost } from "@/interface/post";
import { Button, Space, Table } from "antd";
import { toast } from "sonner";
import { useDeletePostMutation } from "@/hook/postHook";
import { IOrderRouteRequest, IOrderRouteResponse, IOrderRouteResponseDetail } from "@/interface/orderRoute";
import { IDepartment } from "@/interface/department";
import { useDeleteOrderRouteMutation } from "@/hook/orderRouterHook";
import Link from "next/link";

interface RouteTableProps {
  routeData: IOrderRouteResponseDetail[] | undefined;
  onEdit: (id: number) => void;
}

const RouteTable: React.FC<RouteTableProps> = ({ routeData, onEdit }) => {
const {mutate:deleteOrderRouteMutation} = useDeleteOrderRouteMutation()
  const columns = [
    {
      title: "ID",
      dataIndex: "route_id",
      key: "route_id",
    },
    {
      title: "Маршрут",
      dataIndex: "route_name",
      key: "route_name",
    },
    {
      title: "Подразделение",
      dataIndex: "department",
      key: "department",
      render: (department:IDepartment) => department?.department_name
    },
    {
      title: "Действия",
      key: "action",
      render: (_: any, record: IOrderRouteResponseDetail) => (
        <Space size="middle">
          <Link href={`/i/routes/${record.route_id}`}>
            Изменить
          </Link>
          <Button
            type="primary"
            danger
            onClick={() =>
              toast.error("Вы точно хотите удалить маршрут ?", {
                style: {
                  color: "red",
                },
                action: {
                  label: "Удалить",
                  onClick: () => deleteOrderRouteMutation({route_id:record.route_id as number, route_name:record.route_name}),

                },
              })
            }
          >
            Удалить
          </Button>
        </Space>
      ),
    },
  ];

  const dataSource = routeData?.map((route) => ({
    ...route,
    key: route.route_id, // Ensure each item has a unique key
  }));
  console.log(dataSource)
  return <Table dataSource={dataSource} columns={columns} />;
};

export default RouteTable;
