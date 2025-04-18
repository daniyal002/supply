import { useDeleteOrderProductCommentMutation } from "@/hook/orderHook";
import { IOrderProductCommentsResponse } from "@/interface/orderProductComments";
import { CloseOutlined } from "@ant-design/icons";
import { Button, Collapse, ConfigProvider, Space, Table } from "antd";

interface Props {
  order_product_id: number;
  product_id: number;
  orderProductComments: IOrderProductCommentsResponse[];
  setOrderProductId: (order_product_id: number) => void;
  setProductId: (order_product_id: number) => void;
  showModal: () => void;
  setProductIndex: (key: number) => void;
  orderId: number;
}

export const ExpandedRowContent = ({
  orderProductComments,
  order_product_id,
  product_id,
  setOrderProductId,
  setProductId,
  setProductIndex,
  showModal,
  orderId,
}: Props) => {
  const dataSource: IOrderProductCommentsResponse[] = orderProductComments?.map(
    (product, index) => ({
      ...product,
      key: index, // Ensure each item has a unique key
    })
  );

  const { mutate: deleteOrderProductCommentMutation } =
    useDeleteOrderProductCommentMutation(orderId);

  return (
    <>
      <Button
        onClick={() => {
          setOrderProductId(order_product_id as number);
          setProductId(product_id as number);
          showModal();
          setProductIndex(order_product_id);
        }}
        style={{ marginBottom: "10px" }}
      >
        Добавить комментарий
      </Button>
      {!dataSource || dataSource?.length === 0 ? (
        <div>Данные не найдены</div>
      ) : (
        <Collapse
          items={[
            {
              key: "comments-panel", // Уникальный ключ для панели
              label: "Комментарии к товару", // Заголовок (можно оставить пустым)
              children: (
                <ConfigProvider
                  theme={{
                    components: {
                      Table: {
                        colorBgContainer: "#cadce8",
                      },
                    },
                  }}
                >
                  <Table
                    dataSource={dataSource}
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
                </ConfigProvider>
              ),
            },
          ]}
        />
      )}
    </>
  );
};
