import { IBasicUnit } from "@/interface/basicUnit";
import { IEmployeeFromParlorGetMe } from "@/interface/employee";
import { IProduct } from "@/interface/product";
import { IProductTable, IProductTableRequest } from "@/interface/productTable";
import { IUnit } from "@/interface/unit";
import { Button, Space, Table, TableColumnsType } from "antd";
import { useEffect, useState } from "react";

interface productOrderTableProps {
  productTableData: IProductTable[] | undefined;
  showModal: () => void;
  setProductId: (product: number) => void;
  setProductIndex: (key: number) => void;
  deleteProduct: (key: number) => void;
  setIsNewProduct: (isNewProduct:boolean) => void;
}

const ProductOrderTable: React.FC<productOrderTableProps> = ({
  productTableData,
  setProductId,
  showModal,
  setProductIndex,
  deleteProduct,
  setIsNewProduct,
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
      title: "Добавленный товар",
      dataIndex: "order_product_name",
      key: "order_product_name",
      sorter: {
        compare: (a: any, b: any) =>
          a.product.order_product_name.localeCompare(b.product.order_product_name, "ru"),
      },
    },
    {
      title: "Ссылка товар",
      dataIndex: "order_product_link",
      key: "order_product_link",
      sorter: {
        compare: (a: any, b: any) =>
          a.product.order_product_link.localeCompare(b.product.order_product_link, "ru"),
      },
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
      title: "Действия",
      key: "action",
      render: (record: IProductTable) => (
        <Space size="middle">
          <div style={{display:"flex",flexWrap:"wrap",gap:"10px"}}>
            <Button
              onClick={() => {
                setProductId(record.product ? record.product.product_id as number: NaN);
                showModal();
                setIsNewProduct( record.product ? false :true  );
                // @ts-ignore: Unreachable code error
                setProductIndex(record.key);
              }}
            >
              Изменить
            </Button>
            <Button
              danger
              type="primary"
              onClick={() => {
                // @ts-ignore: Unreachable code error
                deleteProduct(record.key);
              }}
            >
              Удалить
            </Button>
          </div>
        </Space>
      ),
    },
  ];

  const dataSource = productTableData?.map((product, index) => ({
    ...product,
    key: index, // Ensure each item has a unique key
  }));

  return <Table dataSource={dataSource} columns={columns} />;
};

export default ProductOrderTable;
