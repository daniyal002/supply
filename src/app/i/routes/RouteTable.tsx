'use client';

import { IPost } from "@/interface/post";
import { Button, Space, Table } from "antd";
import { toast } from "sonner";
import { useDeletePostMutation } from "@/hook/postHook";
import { IOrderRouteRequest, IOrderRouteResponse } from "@/interface/orderRoute";

interface RouteTableProps {
  routeData: IOrderRouteRequest[] | undefined;
  onEdit: (id: number) => void;
}

const RouteTable: React.FC<RouteTableProps> = ({ routeData, onEdit }) => {

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
      title: "Действия",
      key: "action",
      render: (_: any, record: IOrderRouteRequest) => (
        <Space size="middle">
          <Button type="dashed" onClick={() => onEdit(record.route_id as number)}>
            Изменить
          </Button>
          <Button
            type="primary"
            danger
            onClick={() =>
              toast.error("Вы точно хотите удалить должность ?", {
                style: {
                  color: "red",
                },
                action: {
                  label: "Удалить",
                  onClick: () => console.log(record),
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

  return <Table dataSource={dataSource} columns={columns} />;
};

export default RouteTable;
