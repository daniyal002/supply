"use client";

import { Button, Table, TableColumnsType } from "antd";
import { ClearOutlined, SyncOutlined } from "@ant-design/icons";
import { IProductUnit } from "@/interface/product";
import { IOrderItemFormValues } from "@/interface/orderItem";
import { UseFormGetValues, UseFormWatch } from "react-hook-form";
import style from "./SelectProductOrderTable.module.scss";
import { RemainProduct } from "../../../../components/UI/RemainProduct/RemainProduct";
import { TableProps } from "antd/lib";

interface ProductTableProps {
  productData: IProductUnit[];
  showModal: () => void;
  setProductId: (product: number) => void;
  getValues: UseFormGetValues<IOrderItemFormValues>;
  refetch: () => void;
  watch: UseFormWatch<IOrderItemFormValues>;
  expandedRowKeys: string[];
  setExpandedRowKeys: (keys: string[]) => void;
  currentFilters: number;
  clearAll: () => void;
  columns: TableColumnsType<IProductUnit>;
  onChange: TableProps<IProductUnit>["onChange"];
}

const SelectProductOrderTable: React.FC<ProductTableProps> = ({
  productData,
  showModal,
  setProductId,
  getValues,
  refetch,
  watch,
  expandedRowKeys,
  setExpandedRowKeys,
  currentFilters,
  clearAll,
  columns,
  onChange,
}) => {
  const orderProducts = watch("order_products");

  return (
    <Table
      dataSource={productData}
      onChange={onChange}
      columns={columns}
      size="large"
      scroll={{ x: 200 }}
      rowKey={(record) => record.product_kod_1c}
      pagination={{ locale: { items_per_page: "/ Товаров" } }}
      footer={() => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p>Товаров: {currentFilters}</p>
            <p>Выбранно товаров: {orderProducts?.length}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Button onClick={() => refetch()} title="Обновить товары">
              <SyncOutlined />
            </Button>
            <Button onClick={() => clearAll()} title="Очистить все фильтры">
              <ClearOutlined />
            </Button>
          </div>
        </div>
      )}
      // onChange={handleChange}
      rowClassName={(record) =>
        getValues("order_products")?.find(
          (product) => product?.product?.product_id === record?.product_id
        )
          ? style.highlightRow
          : ""
      }
      locale={{ emptyText: "Нет товаров" }}
      expandable={{
        expandedRowKeys,
        onExpand: (expanded, record) => {
          const key = record.product_kod_1c;
          let newKeys = [...expandedRowKeys];
          if (expanded) newKeys.push(key);
          else newKeys = newKeys.filter((k) => k !== key);
          setExpandedRowKeys(newKeys);
        },
        expandedRowRender: (record) => {
          return (
            <div className={style.remainContainer}>
              <RemainProduct
                product_kod_1c={record?.product_kod_1c}
                expandedRowKeys={expandedRowKeys}
              />
            </div>
          );
        },
      }}
      onRow={(record) => ({
        onDoubleClick: () => {
          record.product_group.product_group_id ===
            getValues("product_group.value") && showModal();
          setProductId(record.product_id);
        },
      })}
    />
  );
};

export default SelectProductOrderTable;
