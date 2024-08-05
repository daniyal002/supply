'use client';

import { Button, Space, Table, TableColumnsType } from "antd";
import { IProductGroup, IProductUnit } from "@/interface/product";
import { IBasicUnit } from "@/interface/basicUnit";

interface ProductTableProps {
  productData: IProductUnit[] | undefined;
  showModal: () => void,
  setProductId: (product: number) => void
}

const SelectProductOrderTable: React.FC<ProductTableProps> = ({ productData, showModal,setProductId }) => {

  const columns: TableColumnsType<IProductUnit> = [
    {
      title: "Товар",
      dataIndex: "product_name",
      key: "product_name",
      sorter: {
        compare: (a: any, b: any) =>
          a.product_name.localeCompare(b.product_name, "ru"),
      },
    },
    {
      title: "Группа товаров",
      dataIndex: "product_group",
      key: "product_group",
      sorter: {
        compare: (a: any, b: any) =>
          a.product_group.name.localeCompare(b.product_group.name, "ru"),
      },
      render: (product_group: IProductGroup) => product_group.name,
      responsive: ["sm"],
    },
    {
      title: "Ед. измерения",
      dataIndex: "unit_measurement",
      key: "unit_measurement",
      sorter: {
        compare: (a: any, b: any) =>
          a.unit_measurement.name.localeCompare(b.unit_measurement.name, "ru"),
      },
      render: (unit_measurement: IBasicUnit) => unit_measurement.name,
      responsive: ["sm"],
    },
    {
      title: "Действия",
      key: "action",
      render: (_: any, record: IProductUnit) => (
        <Space size="middle">
        <div>
          <Button
            onClick={() => {
              showModal();
              setProductId(record.product_id);
            }}
          >
            Добавить
          </Button>
        </div>
      </Space>
      ),
    },
  ];

  const dataSource = productData?.map((product) => ({
    ...product,
    key: product.product_id, // Ensure each item has a unique key
  }));

  return <Table dataSource={dataSource} columns={columns} />;
};

export default SelectProductOrderTable;
