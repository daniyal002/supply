"use client";

import { Button, Space, Table, TableColumnsType } from "antd";
import { toast } from "sonner";
import { IEmployee } from "@/interface/employee";
import { IOrderItem, IStatusOrder } from "@/interface/orderItem";
import { IDepartment } from "@/interface/department";
import { useDeleteOrderMutation } from "@/hook/orderHook";
import { useOrderIdStore } from "../../../../store/orderIdStore";

interface OrderListProps {
  OrderData: IOrderItem[] | undefined;
}

const OrderListTable: React.FC<OrderListProps> = ({ OrderData }) => {
  const { mutate: deleteOrderMutation } = useDeleteOrderMutation();
  const setOrderId = useOrderIdStore(state => state.setOrderId)
  const columns: TableColumnsType<IOrderItem> = [
    {
      title: "№",
      dataIndex: "order_number",
      key: "order_number",
      sorter: (a: any, b: any) =>
        a.order_number.localeCompare(b.order_number, "ru"),
    },
    {
      title: "Дата",
      dataIndex: "created_at",
      key: "created_at",
      sorter: (a: any, b: any) =>
        a.created_at.localeCompare(b.created_at, "ru"),
      render: (text: string) => {
        const date = new Date(text);
        return date.toLocaleString("ru-RU", {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
      },
    },
    {
      title: "Статус",
      dataIndex: "order_status",
      key: "order_status",
      sorter: (a: any, b: any) =>
        a.order_status.order_status_name.localeCompare(
          b.order_status.order_status_name,
          "ru"
        ),
      render: (order_status: IStatusOrder) => order_status?.order_status_name,
    },
    {
      title: "Врач/Кабинет",
      dataIndex: "buyer",
      key: "buyer",
      sorter: (a: any, b: any) =>
        a.buyer.buyer_name.localeCompare(b.buyer.buyer_name, "ru"),
      render: (buyer: IEmployee) => buyer?.buyer_name,
      responsive: ["lg"],
    },
    {
      title: "Подразделение",
      dataIndex: "department",
      key: "department",
      sorter: (a: any, b: any) =>
        a.department_name.localeCompare(b.department_name, "ru"),
      render: (department: IDepartment) => department?.department_name,
    },
    {
      title: "ОМС/ПУ",
      dataIndex: "oms",
      key: "oms",
      // sorter: (a: any, b: any) => a?.post?.post_name?.localeCompare(b?.post?.post_name, 'ru'),
      render: (oms: boolean) => (oms === true ? "ОМС" : "ПУ"),
      responsive: ["lg"],
    },
    {
      title: "Действия",
      key: "action",
      render: (_: any, record: IOrderItem) => (
        <Space size="middle">
          {/* <Link href={`/order/${record.order_id}`}>Изменить</Link> */}
          <Button onClick={() => setOrderId(String(record.order_id))}>Изменить</Button>
          <Button
            type="primary"
            danger
            onClick={() =>
              toast.error("Вы точно хотите удалить заявку ?", {
                style: {
                  color: "red",
                },
                action: {
                  label: "Удалить",
                  onClick: () => deleteOrderMutation(record),
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

  const dataSource = OrderData?.map((order) => ({
    ...order,
    key: order.order_id, // Ensure each item has a unique key
  }));

  return (
    <Table dataSource={dataSource} columns={columns} scroll={{ x: 200 }} />
  );
};

export default OrderListTable;
