import { formatNotificationDate } from "@/helper/DataFormat";
import { IOrderProductCommentsResponse } from "@/interface/orderProductComments";
import { IProductPreviousOrders } from "@/interface/productTable";
import { Collapse, Table, Tooltip } from "antd";
import style from "./ProductOrderTable.module.scss";

interface Props {
  orderProductComments: IOrderProductCommentsResponse[];
  productPreviousOrders: IProductPreviousOrders[];
  orderId: number;
  coefficient?: number;
  basicUnit?: string;
}

export const ExpandedRowContent = ({
  orderProductComments,
  productPreviousOrders,
  coefficient,
  basicUnit
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
                        render: (comment: string) =>
                          comment && comment.length > 50 ? (
                            <Tooltip title={comment}>
                              {`${comment.substring(0, 50)}...`}
                            </Tooltip>
                          ) : (
                            comment
                          ),
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
                    rowClassName={(record) =>
                      record?.is_cancel === true
                        ? style.highlightRowIsCancel
                        : ""
                    }
                    rowHoverable={false}
                    onRow={(record) => ({
                      title: record?.is_cancel
                        ? "Товар отклонен. Перейти в заявку для просмотра комментария"
                        : "",
                    })}
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
                        title: "Согласованное количество",
                        dataIndex: "product_count",
                        key: "product_quantity",
                      },
                      {
                        title: "Выданное количество",
                        key: "issued_quantity_and_unit_measurement_coefficient",
                        width: "250px",
                        render: (record: IProductPreviousOrders) => (
                          <div style={{ display: "flex", gap: "10px" }}>
                            <p>{record?.issued_quantity}</p>
                            {coefficient &&
                              coefficient !== 1 &&
                              record?.issued_quantity && (
                                <p>
                                  (
                                  {Math.round(
                                    record?.issued_quantity * coefficient
                                  )}{" "}
                                  {basicUnit})
                                </p>
                              )}
                          </div>
                        ),
                      },
                      {
                        title: "Ед. измерения",
                        dataIndex: "unit_measurement_name",
                        key: "unit_measurement_name",
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
