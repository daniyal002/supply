import { formatNotificationDate } from "@/helper/DataFormat";
import { useDeleteOrderProductCommentMutation } from "@/hook/orderHook";
import { IOrderProductCommentsResponse } from "@/interface/orderProductComments";
import { IProductPreviousOrders } from "@/interface/productTable";
import { Collapse, Table } from "antd";

interface Props {
  orderProductComments: IOrderProductCommentsResponse[];
  productPreviousOrders: IProductPreviousOrders[];
  orderId: number;
}

export const ExpandedRowContent = ({
  orderProductComments,
  productPreviousOrders,
  orderId,
}: Props) => {
  const dataSourceProductComments: IOrderProductCommentsResponse[] =
    orderProductComments?.map((product, index) => ({
      ...product,
      key: index, // Ensure each item has a unique key
    }));

  const dataSourceProductPreviousOrders: IProductPreviousOrders[] =
    productPreviousOrders?.map((product, index) => ({
      ...product,
      key: index, // Ensure each item has a unique key
    }));

  const { mutate: deleteOrderProductCommentMutation } =
    useDeleteOrderProductCommentMutation(orderId);

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {!dataSourceProductComments ||
        dataSourceProductComments?.length === 0 ? (
          <div style={{ margin: "12px 16px" }}>Данные не найдены</div>
        ) : (
          <Collapse
            items={[
              {
                key: "comments-panel", // Уникальный ключ для панели
                label: "Комментарии к товару", // Заголовок (можно оставить пустым)
                children: (
                  <Table
                    dataSource={dataSourceProductComments}
                    columns={[
                      {
                        title: "Сотрудник",
                        dataIndex: "employee",
                        key: "employee",
                      },
                      {
                        title: "Количество",
                        dataIndex: "product_count",
                        key: "product_count",
                      },
                      {
                        title: "Комментарий",
                        dataIndex: "comment",
                        key: "comment",
                      },
                      {
                        title: "Дата",
                        dataIndex: "created_at",
                        key: "created_at",
                        render: (data: string) => formatNotificationDate(data)
                      },
                    ]}
                    pagination={false}
                  />
                ),
              },
            ]}
          />
        )}

        {!dataSourceProductPreviousOrders ||
        dataSourceProductPreviousOrders?.length === 0 ? (
          <div style={{ margin: "12px 16px" }}>
            Ранее этот товар не заказывали
          </div>
        ) : (
          <Collapse
            items={[
              {
                key: "product-previous-orders-panel", // Уникальный ключ для панели
                label: "Предыдущие заказы за год", // Заголовок (можно оставить пустым)
                children: (
                  <Table
                    dataSource={dataSourceProductPreviousOrders}
                    columns={[
                      {
                        title: "В Заявке",
                        dataIndex: "order_id",
                        key: "order_id",
                      },
                      {
                        title: "Количество",
                        dataIndex: "product_quantity",
                        key: "product_quantity",
                      },
                      {
                        title: "На кого",
                        dataIndex: "buyer_name",
                        key: "buyer_name",
                      },
                      {
                        title: "Дата",
                        dataIndex: "created_at",
                        key: "created_at",
                        render: (data: string) => formatNotificationDate(data),
                      },
                    ]}
                    pagination={false}
                  />
                ),
              },
            ]}
          />
        )}
      </div>
    </>
  );
};
