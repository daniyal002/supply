import { formatNotificationDate } from "@/helper/DataFormat";
import { useDeleteOrderProductCommentMutation } from "@/hook/orderHook";
import { IOrderProductCommentsResponse } from "@/interface/orderProductComments";
import { IProductPreviousOrders } from "@/interface/productTable";
import { CloseOutlined } from "@ant-design/icons";
import { Button, Collapse, Space, Table } from "antd";

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
  is_cancel:boolean;
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
}: Props) => {
  const dataSourceProductComments: IOrderProductCommentsResponse[] = orderProductComments?.map(
    (product, index) => ({
      ...product,
      key: index, // Ensure each item has a unique key
    })
  );

  const dataSourceProductPreviousOrders: IProductPreviousOrders[] = productPreviousOrders?.map(
    (product, index) => ({
      ...product,
      key: index, // Ensure each item has a unique key
    })
  );


  const { mutate: deleteOrderProductCommentMutation } =
    useDeleteOrderProductCommentMutation(orderId);

  return (
    <>
    {!is_cancel && (
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
  <div style={{display:'flex', flexDirection:"column", gap:"10px"}}>
      {!dataSourceProductComments || dataSourceProductComments?.length === 0 ? (
        <div style={{margin:"12px 16px"}}>Данные не найдены</div>
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

      {!dataSourceProductPreviousOrders || dataSourceProductPreviousOrders?.length === 0 ? (
        <div style={{margin:"12px 16px"}}>Ранее этот товар этот не заказывали</div>
      ) : (
        <Collapse
          items={[
            {
              key: "product-previous-orders-panel", // Уникальный ключ для панели
              label: "Предыдущие заказы c первого числа текущего месяца", // Заголовок (можно оставить пустым)
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
                        render: (data:string) => formatNotificationDate(data)
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
