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

  const productGroup = productData?.map(product => ({
    text: product.product_group.product_group_name,
    value: product.product_group.product_group_id
  }))

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
          a.product_group.product_group_name.localeCompare(b.product_group.product_group_name, "ru"),
      },
      render: (product_group: IProductGroup) => product_group.product_group_name,
      responsive: ["sm"],
      filters: productGroup,
      onFilter: (value, record) => record.product_group.product_group_id === value,
    },
    {
      title: "Ед. измерения",
      dataIndex: "unit_measurement",
      key: "unit_measurement",
      sorter: {
        compare: (a: any, b: any) =>
          a.unit_measurement.unit_measurement_name.localeCompare(b.unit_measurement.unit_measurement_name, "ru"),
      },
      render: (unit_measurement: IBasicUnit) => unit_measurement.unit_measurement_name,
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
