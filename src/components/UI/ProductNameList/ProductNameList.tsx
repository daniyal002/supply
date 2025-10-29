import { Table, Spin, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useGetOrderById } from "@/hook/orderHook";

const { Text } = Typography;

interface Props {
  orderId: number;
  expandedRowKeys?: number[];
}

export const ProductNameList: React.FC<Props> = ({
  orderId,
  expandedRowKeys,
}) => {
  const { getOrderByIdData, isError, isLoading } = useGetOrderById(
    String(orderId) as string
  );

  const [currentFilters, setCurrentFilters] = useState<number>(0);

  useEffect(() => {
    if (!isLoading && !isError && getOrderByIdData?.order_products) {
      setCurrentFilters(getOrderByIdData.order_products.length);
    }
  }, [isLoading, isError, getOrderByIdData]);

  if (isLoading) {
    return <Spin style={{ display: "block", margin: "20px auto" }} />;
  }

  if (isError) {
    return <Text>Ошибка загрузки товаров</Text>;
  }

  const columns = [
    {
      title: "Товар",
      dataIndex: "product_name",
      key: "product_name",
      width: "400px",
    },
    {
      title: "Добавленный товар",
      dataIndex: "product_add_name",
      key: "product_add_name",
      width: "400px",
    },
    {
      title: "Количество",
      dataIndex: "product_quantity",
      key: "product_quantity",
      width: "50px",
    },
    {
      title: "Ед. измерения",
      dataIndex: "product_unit",
      key: "product_unit",
      width: "50px",
    },
  ];

  // Подготовка данных для таблицы
  const dataSource =
    getOrderByIdData?.order_products?.map((product, index) => ({
      key: index,
      product_name: product?.product?.product_name,
      product_add_name: product?.order_product_name,
      product_quantity: product?.product_quantity,
      product_unit:
        product?.unit_measurement.unit_measurement.unit_measurement_name,
    })) || [];

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      pagination={false}
      size="large"
      style={{ marginBottom: 16 }}
      locale={{
        emptyText: "Нет товаров",
      }}
      footer={() => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p>Товаров: {currentFilters ?? 0}</p>
        </div>
      )}
    />
  );
};
