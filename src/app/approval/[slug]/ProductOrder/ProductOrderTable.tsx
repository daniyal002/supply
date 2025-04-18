import { IEmployeeFromParlorGetMe } from "@/interface/employee";
import { IProduct } from "@/interface/product";
import { IProductTable } from "@/interface/productTable";
import { IUnit } from "@/interface/unit";
import { Button, Space, Table, TableColumnsType } from "antd";
import { useState } from "react";
import { ExpandedRowContent } from "./ExpandedRowContent";

interface productOrderTableProps {
  productTableData: IProductTable[] | undefined;
  showModal: () => void;
  setOrderProductId: (product: number) => void;
  setProductId: (product: number) => void;
  setProductIndex: (key: number) => void;
  deleteProduct: (key: number) => void;
  orderId:number
}

const ProductOrderTable: React.FC<productOrderTableProps> = ({
  productTableData,
  setOrderProductId,
  setProductId,
  showModal,
  setProductIndex,
  deleteProduct,
  orderId
}) => {
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

            />
          ),
      }}
      footer={() => "Всего: " + productTableData?.length}
      rowKey="order_product_id"
    />
  );
};

export default ProductOrderTable;
