"use client";

import { Button, Table } from "antd";
import {SyncOutlined, ClearOutlined } from "@ant-design/icons";
import { IProductUnit } from "@/interface/product";
import { TableColumnsType, TableProps } from "antd/lib";
import { RemainProduct } from "@/components/UI/RemainProduct/RemainProduct";
import style from "./SelectProductOrderTable.module.scss";

interface Props {
  data: IProductUnit[];
  onChange: TableProps<IProductUnit>["onChange"];
  refetch: () => void;
  expandedRowKeys: string[];
  setExpandedRowKeys: (keys: string[]) => void;
  currentFilters: number;
  clearAll: () => void;
  columns:TableColumnsType<IProductUnit>
}

export const ProductTable: React.FC<Props> = ({
  data,
  onChange,
  refetch,
  expandedRowKeys,
  setExpandedRowKeys,
  currentFilters,
  clearAll,
  columns
}) => {


  return (
    <Table
      dataSource={data}
      columns={columns}
      rowKey="product_kod_1c"
      onChange={onChange}
      scroll={{ x: 200 }}
      pagination={{ locale: { items_per_page: "/ Товаров" } }}
      size="large"
      footer={() => (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p>Товаров: {currentFilters}</p>
          <div style={{ display: "flex", gap: 10 }}>
            <Button onClick={() => refetch()}>
              <SyncOutlined />
            </Button>
            <Button onClick={clearAll}>
              <ClearOutlined />
            </Button>
          </div>
        </div>
      )}
      expandable={{
        expandedRowKeys,
        onExpand: (expanded, record) => {
          const key = record.product_kod_1c;
          let newKeys = [...expandedRowKeys];
          if (expanded) newKeys.push(key);
          else newKeys = newKeys.filter((k) => k !== key);
          setExpandedRowKeys(newKeys);
        },
        expandedRowRender: (record) => (
          <div className={style.remainContainer}>
            <RemainProduct product_kod_1c={record.product_kod_1c} />
          </div>
        ),
      }}
    />
  );
};
