import { formatNotificationDate } from "@/helper/DataFormat";
import { useDeleteOrderProductCommentMutation } from "@/hook/orderHook";
import { IOrderProductCommentsResponse } from "@/interface/orderProductComments";
import { IProductPreviousOrders } from "@/interface/productTable";
import { CloseOutlined } from "@ant-design/icons";
import { Button, Collapse, Space, Table, Tooltip } from "antd";
import { useOrderIdStore } from "../../../../../store/orderIdStore";
import { useTabStore } from "../../../../../store/tabStore";
import style from "./ProductOrderTable.module.scss";

interface Props {
  order_product_id: number;
  product_id: number;
  orderProductComments: IOrderProductCommentsResponse[];
  productPreviousOrders: IProductPreviousOrders[];
  setOrderProductId: (order_product_id: number) => void;
  setProductId: (order_product_id: number) => void;
  showModal: () => void;
  setProductIndex: (key: number) => void;
  orderId: number;
  is_cancel: boolean;
  readonly?: boolean;
  coefficient?: number;
  basicUnit?: string;
}

export const ExpandedRowContent = ({
  orderProductComments,
  productPreviousOrders,
  order_product_id,
  product_id,
  setOrderProductId,
  setProductId,
  setProductIndex,
  showModal,
  orderId,
  is_cancel,
  coefficient,
  readonly = false,
  basicUnit,
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
  const setActiveMainTabKey = useTabStore((state) => state.setActiveMainTabKey);

  const setAllOrderId = useOrderIdStore((state) => state.setAllOrderId);

  return (
    <>
      {!is_cancel && !readonly && (
        <Button
          onClick={() => {
            setOrderProductId(order_product_id as number);
            setProductId(product_id as number);
            showModal();
            setProductIndex(order_product_id);
          }}
          style={{ marginBottom: "10px" }}
          title="Добавить комментарий"
        >
          Добавить комментарий
        </Button>
      )}
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
                      {
                        title: "Действия",
                        key: "action",

                        render: (record: IOrderProductCommentsResponse) => (
                          <Space size="middle">
                            <CloseOutlined
                              style={{ color: "red", cursor: "pointer" }}
                              onClick={() =>
                                deleteOrderProductCommentMutation({
                                  comment_id: record.comment_id as number,
                                })
                              }
                            />
                          </Space>
                        ),
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
                        render: (order_id: number) => (
                          <Button
                            onClick={() => {
                              setAllOrderId(String(order_id));
                              setActiveMainTabKey("5");
                            }}
                            title={`Перейти в заявку ${order_id}`}
                          >
                            {order_id}
                          </Button>
                        ),
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
