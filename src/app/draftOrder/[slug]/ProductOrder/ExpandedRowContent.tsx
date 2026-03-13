import { formatNotificationDate } from "@/helper/DataFormat";
import { IOrderProductCommentsResponse } from "@/interface/orderProductComments";
import { IProductPreviousOrders } from "@/interface/productTable";
import { Collapse, Table, Tooltip } from "antd";
const compareText = (left?: string | null, right?: string | null) =>
  (left ?? "").localeCompare(right ?? "", "ru");

const compareNumber = (left?: number | null, right?: number | null) =>
  (left ?? 0) - (right ?? 0);

const compareDate = (left?: string | null, right?: string | null) =>
  new Date(left ?? 0).getTime() - new Date(right ?? 0).getTime();


interface Props {
  orderProductComments: IOrderProductCommentsResponse[];
  productPreviousOrders: IProductPreviousOrders[];
  orderId: number;
}

export const ExpandedRowContent = ({
  orderProductComments,
  productPreviousOrders,
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
                        sorter: {
                          compare: (a, b) => compareText(a.employee, b.employee),
                        },
                      },
                      {
                        title: "Количество",
                        dataIndex: "product_count",
                        key: "product_count",
                        sorter: {
                          compare: (a, b) => compareNumber(a.product_count, b.product_count),
                        },
                      },
                      {
                        title: "Комментарий",
                        dataIndex: "comment",
                        key: "comment",
                        sorter: {
                          compare: (a, b) => compareText(a.comment, b.comment),
                        },
                        render: (comment: string) => (
                          comment && comment.length > 50 ? (
                            <Tooltip title={comment}>
                              {`${comment.substring(0, 50)}...`}
                            </Tooltip>
                          ) : (
                            comment
                          )
                        )
                      },
                      {
                        title: "Дата",
                        dataIndex: "created_at",
                        key: "created_at",
                        sorter: {
                          compare: (a, b) => compareDate(a.created_at, b.created_at),
                        },
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
                        sorter: {
                          compare: (a, b) => compareNumber(a.order_id, b.order_id),
                        },
                      },
                      {
                        title: "Количество",
                        dataIndex: "product_quantity",
                        key: "product_quantity",
                        sorter: {
                          compare: (a, b) => compareNumber(a.product_quantity, b.product_quantity),
                        },
                      },
                      {
                        title: "На кого",
                        dataIndex: "buyer_name",
                        key: "buyer_name",
                        sorter: {
                          compare: (a, b) => compareText(a.buyer_name, b.buyer_name),
                        },
                      },
                      {
                        title: "Дата",
                        dataIndex: "created_at",
                        key: "created_at",
                        sorter: {
                          compare: (a, b) => compareDate(a.created_at, b.created_at),
                        },
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
