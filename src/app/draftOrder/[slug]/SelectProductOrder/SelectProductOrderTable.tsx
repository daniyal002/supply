"use client";

import { Button, Space, Table, TableColumnsType } from "antd";
import { ClearOutlined, SearchOutlined, SyncOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { useEffect, useMemo, useState } from "react";
import { IProductGroup, IProductUnit } from "@/interface/product";
import SearchFilter from "@/helper/TableFilters/Filters/SearchFilter";
import { useSearch } from "@/helper/TableFilters/hook/useSearch";
import { filterBySearchText } from "@/helper/TableFilters/Filters/filterBySearchText";
import { IOrderItemFormValues } from "@/interface/orderItem";
import { UseFormGetValues } from "react-hook-form";
import style from "./SelectProductOrderTable.module.scss";
import { RemainProduct } from "@/components/UI/RemainProduct/RemainProduct";
import { IUnit } from "@/interface/unit";
import { TableProps } from "antd/lib";

interface ProductTableProps {
  productData: IProductUnit[];
  showModal: () => void;
  setProductId: (product: number) => void;
  getValues: UseFormGetValues<IOrderItemFormValues>;
  refetch: () => void;
}

type OnChange = NonNullable<TableProps<IProductUnit>["onChange"]>;
type Filters = Parameters<OnChange>[1];

type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

const SelectProductOrderTable: React.FC<ProductTableProps> = ({
  productData,
  showModal,
  setProductId,
  getValues,
  refetch,
}) => {
  const { searchText, searchedColumn, searchInput, handleSearch, handleReset } =
    useSearch();

  const unitGroup = useMemo(() => {
    const productSet = new Set();
    return productData
      ?.filter((product) => {
        if (productSet.has(product.unit_measurement.unit_measurement_id)) {
          return false;
        } else {
          productSet.add(product.unit_measurement.unit_measurement_id);
          return true;
        }
      })
      .map((product) => ({
        value: product.unit_measurement.unit_measurement_id,
        text: product.unit_measurement.unit_measurement_name,
      }));
  }, [productData]);

  const productGroup = useMemo(() => {
    const productSet = new Set();
    return productData
      ?.filter((product) => {
        if (productSet.has(product.product_group.product_group_id)) {
          return false;
        } else {
          productSet.add(product.product_group.product_group_id);
          return true;
        }
      })
      .map((product) => ({
        value: product.product_group.product_group_id,
        text: product.product_group.product_group_name,
      }));
  }, [productData]);

  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});

  const handleChange: OnChange = (pagination, filters, sorter, extra) => {
    setCurrentFilters(extra.currentDataSource.length);
    setFilteredInfo(filters);
    setSortedInfo(sorter as Sorts);
  };

  const clearAll = () => {
    setCurrentFilters(dataSource.length);
    setFilteredInfo({});
    setSortedInfo({});
  };

  const columns: TableColumnsType<IProductUnit> = [
    {
      title: "Товар",
      dataIndex: "product_name",
      key: "product_name",
      width: "400px",
      showSorterTooltip: { title: "Сортировка по товару" },
      sorter: (a, b) => a.product_name.localeCompare(b.product_name, "ru"),
      filterDropdown: (props) => (
        <SearchFilter
          {...props}
          placeholder="Поиск по товару"
          searchText={searchText}
          searchedColumn={searchedColumn}
          dataIndex="product_name"
          searchInput={searchInput}
          handleSearch={handleSearch}
          handleReset={handleReset}
        />
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined
          style={{ color: filtered ? "#1677ff" : undefined, fontSize: "18px" }}
        />
      ),
      onFilter: (value, record) => {
        const searchValue = (value as string).toLowerCase();
        const productName = record.product_name.toString().toLowerCase();

        return filterBySearchText(searchValue, productName);
      },
      render: (text) =>
        searchedColumn === "product_name" ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : (
          text
        ),
      filteredValue: filteredInfo.product_name || null,
      sortOrder:
        sortedInfo.columnKey === "product_name" ? sortedInfo.order : null,
    },
    {
      title: "Категория товаров",
      dataIndex: "product_group",
      key: "product_group",
      width: "350px",
      showSorterTooltip: { title: "Сортировка по категории товаров" },
      sorter: (a, b) =>
        a.product_group.product_group_name.localeCompare(
          b.product_group.product_group_name,
          "ru"
        ),
      render: (product_group: IProductGroup) =>
        product_group.product_group_name,
      responsive: ["sm"],
      filters: productGroup,
      filterSearch:true,
      onFilter: (value, record) =>
        record.product_group.product_group_id === value,
      sortOrder:
        sortedInfo.columnKey === "product_group" ? sortedInfo.order : null,
    },
    {
      title: "Артикул",
      dataIndex: "product_article",
      key: "product_article",
      width: "350px",
      showSorterTooltip: { title: "Сортировка по артикулу" },
      sorter: (a, b) =>
        a?.product_article?.localeCompare(b?.product_article ?? "", "ru") ?? 0,
      responsive: ["sm"],
      filterDropdown: (props) => (
        <SearchFilter
          {...props}
          placeholder="Поиск по артиклу"
          searchText={searchText}
          searchedColumn={searchedColumn}
          dataIndex="product_article"
          searchInput={searchInput}
          handleSearch={handleSearch}
          handleReset={handleReset}
        />
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined
          style={{ color: filtered ? "#1677ff" : undefined, fontSize: "18px" }}
        />
      ),
      onFilter: (value, record) => {
        const searchValue = (value as string).toLowerCase();
        const productName =
          record.product_article?.toString().toLowerCase() ?? "";

        return filterBySearchText(searchValue, productName);
      },
      render: (text) =>
        searchedColumn === "product_article" ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : (
          text
        ),
      filteredValue: filteredInfo.product_article || null,
      sortOrder:
        sortedInfo.columnKey === "product_article" ? sortedInfo.order : null,
    },
    {
      title: "Ед. измерения",
      dataIndex: "directory_unit_measurement",
      key: "directory_unit_measurement",
      width: "180px",
      showSorterTooltip: { title: "Сортировка по ед. измерения" },
      sorter: (a, b) => {
        if (!a || !b) return 0;

        const getMainUnit = (product: IProductUnit) => {
          const units = product.directory_unit_measurement;
          if (!units?.length) return null;
          return units.find((u) => u.coefficient > 1) || units[0];
        };

        const unitA = getMainUnit(a);
        const unitB = getMainUnit(b);

        if (!unitA && !unitB) return 0;
        if (!unitA) return -1;
        if (!unitB) return 1;

        return unitA.unit_measurement.unit_measurement_name.localeCompare(
          unitB.unit_measurement.unit_measurement_name,
          "ru"
        );
      },
      render: (directory_unit_measurement: IUnit[]) => {
        const mainUnit =
          directory_unit_measurement.find((unit) => unit.coefficient > 1) ||
          directory_unit_measurement[0];
        return mainUnit?.unit_measurement.unit_measurement_name;
      },
      responsive: ["sm"],
      filters: unitGroup as { text: string; value: number }[],
      filterSearch:true,
      onFilter: (value, record) => {
        const mainUnit =
          record.directory_unit_measurement.find((u) => u.coefficient > 1) ||
          record.directory_unit_measurement[0];
        return mainUnit?.unit_measurement?.unit_measurement_id === value;
      },
      filteredValue: filteredInfo.directory_unit_measurement || null,
      sortOrder:
        sortedInfo.columnKey === "directory_unit_measurement"
          ? sortedInfo.order
          : null,
    },
    {
      title: "Общий остаток",
      key: "remainder",
      dataIndex: "remainder",
      width: "100px",
      showSorterTooltip: { title: "Действия" },
      sorter: {
        compare: (a: any, b: any) => a.remainder - b.remainder,
      },
      sortOrder: sortedInfo.columnKey === "remainder" ? sortedInfo.order : null,
    },
    {
      title: "Действия",
      key: "action",
      width: "100px",
      showSorterTooltip: { title: "Действия" },
      render: (_: any, record: IProductUnit) => (
        <Space size="middle">
          <Button
            onClick={() => {
              showModal();
              setProductId(record.product_id);
            }}
            disabled={
              record.product_group.product_group_id !==
              getValues("product_group.value")
            }
            title="Добавить"
          >
            Добавить
          </Button>
        </Space>
      ),
    },
  ];

  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

  const handleExpand = (expanded: boolean, record: IProductUnit) => {
    const key = record.product_kod_1c;
    let newExpandedRowKeys = [...expandedRowKeys];

    if (expanded) {
      newExpandedRowKeys.push(key);
    } else {
      newExpandedRowKeys = newExpandedRowKeys.filter((k) => k !== key);
    }

    setExpandedRowKeys(newExpandedRowKeys);
  };

  const dataSource = productData?.map((product) => ({
    ...product,
    key: product.product_id, // Ensure each item has a unique key
  }));

  const [currentFilters, setCurrentFilters] = useState<number>(
    dataSource.length
  );

  useEffect(() => {
    setCurrentFilters(dataSource.length);
  }, [productData]);

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      size="large"
      rowKey={(record) => record.product_kod_1c}
      scroll={{ x: 200 }}
      pagination={{ locale: { items_per_page: "/ Товаров" } }}
      footer={() => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p>Товаров: {currentFilters}</p>
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
      onChange={handleChange}
      rowClassName={(record) =>
        getValues("order_products")?.find(
          (product) => product?.product?.product_id === record.product_id
        )
          ? style.highlightRow
          : ""
      }
      locale={{ emptyText: "Нет товаров" }}
      expandable={{
        expandedRowKeys,
        onExpand: handleExpand,
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
