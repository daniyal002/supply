import { IEmployeeFromParlorGetMe } from "@/interface/employee";
import { IProduct } from "@/interface/product";
import { IProductTable } from "@/interface/productTable";
import { IUnit } from "@/interface/unit";
import { Button, Space, Table, TableColumnsType, Tooltip } from "antd";
import { useState } from "react";
import { ExpandedRowContent } from "./ExpandedRowContent";
import { useDeleteOrderProductCancelCommentMutation } from "@/hook/orderHook";
import style from "./ProductOrderTable.module.scss"
import { InfoCircleFilled, InfoCircleOutlined } from "@ant-design/icons";

interface productOrderTableProps {
  productTableData: IProductTable[] | undefined;
  showModal: () => void;
  showModalCancel: () => void;
  setOrderProductId: (product: number) => void;
  setOrderProductIdCancel: (product: number) => void;
  setProductId: (product: number) => void;
  setProductIdCancel: (product: number) => void;
  setProductIndex: (key: number) => void;
  setProductIndexCancel: (key: number) => void;
  deleteProduct: (key: number) => void;
  orderId: number;
}

const ProductOrderTable: React.FC<productOrderTableProps> = ({
  productTableData,
  setOrderProductId,
  setOrderProductIdCancel,
  setProductId,
  setProductIdCancel,
  showModal,
  showModalCancel,
  setProductIndex,
  setProductIndexCancel,
  deleteProduct,
  orderId,
}) => {
  const { mutate: deleteOrderProductCancelCommentMutation } =
    useDeleteOrderProductCancelCommentMutation(orderId);
  const columns: TableColumnsType<IProductTable> = [
    {
      title: "Товар",
      dataIndex: "product",
      key: "product",
      sorter: {
        compare: (a: any, b: any) =>
          a.product.product_name.localeCompare(b.product.product_name, "ru"),
      },
      render: (product: IProduct) => product?.product_name,
    },

    {
      title: "Ед. измерения",
      dataIndex: "unit_measurement",
      key: "unit_measurement",
      sorter: {
        compare: (a: any, b: any) =>
          a.unit_measurement?.unit_measurement.name.localeCompare(
            b.unit_measurement?.unit_measurement.name.name,
            "ru"
          ),
      },
      render: (unit_measurement: IUnit) =>
        unit_measurement?.unit_measurement?.unit_measurement_name,
      responsive: ["sm"],
    },
    {
      title: "Количество",
      dataIndex: "product_quantity",
      key: "product_quantity",
      sorter: {
        compare: (a: any, b: any) => a.count - b.count,
      },
      responsive: ["sm"],
    },
    {
      title: "Врач",
      dataIndex: "buyers",
      key: "buyers",
      render: (buyers: IEmployeeFromParlorGetMe[]) =>
        buyers.map((buyer) => buyer.buyer_name).join(", "),
      responsive: ["sm"],
    },
    {
      title: "Примечание",
      dataIndex: "note",
      key: "note",
      responsive: ["sm"],
    },
    {
      title: "Действия",
      key: "action",
      width: "100px",
      render: (_: any, record: IProductTable) => (
        <Space size="middle">
          {record.is_cancel ? (
            <>
            <Button
              onClick={() =>
                deleteOrderProductCancelCommentMutation({
                  cancel_comment_id:
                    record.order_cancel_comment.comment_cancel_id,
                  order_product_id: record.order_product_id as number,
                })
              }
            >
              Активировать
            </Button>
            <Tooltip title={<span>{record.order_cancel_comment.comment}</span>}>
            <InfoCircleFilled  style={{color:"#fff"}}/>
            </Tooltip>
            </>
          ) : (
            <Button
              onClick={() => {
                showModalCancel();
                setProductIdCancel(record.product.product_id);
                setOrderProductIdCancel(record.order_product_id as number);
                // @ts-ignore: Unreachable code error
                setProductIndexCancel(record.key);
              }}
            >
              Отклонить
            </Button>
          )}
        </Space>
      ),
    },
  ];
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);

  // Обработчик раскрытия строки
  const handleExpand = async (expanded: boolean, record: IProductTable) => {
    const key = record.order_product_id as number;
    setExpandedRowKeys(
      (prev) =>
        expanded
          ? [...prev, key] // Добавляем ключ при раскрытии
          : prev.filter((k) => k !== key) // Удаляем ключ при сворачивании
    );
  };

  return (
    <Table
      dataSource={productTableData}
      columns={columns}
      scroll={{ x: 200 }}
      pagination={{ locale: { items_per_page: "/ Товаров" } }}
      rowClassName={(record) => record.is_cancel === true ? style.highlightRow : ''}
      expandable={{
        expandedRowKeys,
        onExpand: handleExpand,
        expandedRowRender: (record) =>
          record.order_product_comment && (
            <ExpandedRowContent
              orderProductComments={record.order_product_comment}
              product_id={record.product.product_id}
              order_product_id={record.order_product_id as number}
              setOrderProductId={setOrderProductId}
              setProductId={setProductId}
              setProductIndex={setProductIndex}
              showModal={showModal}
              orderId={orderId}
              is_cancel={record.is_cancel as boolean}
            />
          ),
      }}
      rowHoverable={false}
      footer={() => "Всего: " + productTableData?.length}
      rowKey="order_product_id"
    />
  );
};

export default ProductOrderTable;
