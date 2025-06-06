import { Table, Spin, Typography } from 'antd';
import React, { useEffect } from 'react';
import { useRemainProductById } from '@/hook/remainHook';

const { Text } = Typography;

interface Props {
  product_kod_1c: string;
  expandedRowKeys?:string[];
}

export const RemainProduct: React.FC<Props> = ({ product_kod_1c,expandedRowKeys }) => {
  const { remainProductById, isError, isLoading,refetch } = useRemainProductById(product_kod_1c);

  useEffect(() => {
    if(expandedRowKeys)
    if(expandedRowKeys.includes(product_kod_1c)){
        refetch();
    }

  }, [product_kod_1c, refetch,expandedRowKeys]);

  if (isLoading) {
    return <Spin style={{ display: 'block', margin: '20px auto' }} />;
  }

  if (isError) {
    return <Text>Ошибка загрузки остатков</Text>;
  }

  // Подготовка данных для таблицы
  const dataSource = remainProductById?.map((remain, index) => ({
    key: index,
    storage: remain.storage_name,
    quantity: remain.remain_quantity,
    unit_measurement_name: remain.unit_measurement_name,
  })) || [];

  const columns = [
    {
      title: 'Склад',
      dataIndex: 'storage',
      key: 'storage',
    },

    {
        title: 'Ед. Измерения',
      dataIndex: 'unit_measurement_name',
      key: 'unit_measurement_name',
      align: 'right' as const,

    },

    {
        title: 'Остаток',
        dataIndex: 'quantity',
        key: 'quantity',
        align: 'right' as const,

      },
  ];

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      pagination={false}
      size="large"
      style={{ marginBottom: 16 }}
      locale={{
        emptyText: 'Нет данных об остатках',
      }}

    />
  );
};