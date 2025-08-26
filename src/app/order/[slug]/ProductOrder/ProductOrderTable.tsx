import { IEmployeeFromParlorGetMe } from "@/interface/employee";
import { IProduct } from "@/interface/product";
import { IOrderProductStatus, IProductTable } from "@/interface/productTable";
import { IUnit } from "@/interface/unit";
import { Button, Space, Table, TableColumnsType, theme, Tooltip } from "antd";
import {
  FileExcelFilled,
  InfoCircleFilled,
  PrinterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import SearchFilter from "@/helper/TableFilters/Filters/SearchFilter";
import { useSearch } from "@/helper/TableFilters/hook/useSearch";
import { filterBySearchText } from "@/helper/TableFilters/Filters/filterBySearchText";
import { useMemo, useState } from "react";
import { ExpandedRowContent } from "./ExpandedRowContent";
import { RemainProduct } from "@/components/UI/RemainProduct/RemainProduct";
import style from "./ProductOrderTable.module.scss";
import { IOrderItemFormValues } from "@/interface/orderItem";
import { UseFormWatch } from "react-hook-form";
import { useProductTableColumnVisibility } from "@/hook/useProductTableColumnVisibility";

interface productOrderTableProps {
  productTableData: IProductTable[] | undefined;
  showModal: () => void;
  setProductId: (product: number) => void;
  setProductIndex: (key: number) => void;
  deleteProduct: (key: number) => void;
  setIsNewProduct: (isNewProduct: boolean) => void;
  disabledOrder: boolean;
  orderId: number;
  exportToExcel: () => void;
  handlePrint: () => void;
  isPrinting: boolean;
  watch: UseFormWatch<IOrderItemFormValues>;
}

const ProductOrderTable: React.FC<productOrderTableProps> = ({
  productTableData,
  setProductId,
  showModal,
  setProductIndex,
  deleteProduct,
  setIsNewProduct,
  disabledOrder,
  orderId,
  exportToExcel,
  handlePrint,
  isPrinting,
  watch,
}) => {
  const { searchText, searchedColumn, searchInput, handleSearch, handleReset } =
    useSearch();

  const {hasOrderProductName, hasOrderProductLink, hasBuyers, hasNote} =
  useProductTableColumnVisibility(productTableData);

  const orderProductGroup = watch("product_group");

  const unitGroup = useMemo(() => {
    const productSet = new Set();
    return productTableData
      ?.filter((product) => {
        if (
          productSet.has(
            product?.unit_measurement?.unit_measurement?.unit_measurement_id
          )
        ) {
          return false;
        } else {
          productSet.add(
            product?.unit_measurement?.unit_measurement?.unit_measurement_id
          );
          return true;
        }
      })
      .map((product) => ({
        value: product?.unit_measurement?.unit_measurement?.unit_measurement_id,
        text: product?.unit_measurement?.unit_measurement
          ?.unit_measurement_name,
      }));
  }, [productTableData]);

  const {
    token: { colorText },
  } = theme.useToken();

  const columns: TableColumnsType<IProductTable> = [
    {
      title: "Товар",
      dataIndex: "product",
      key: "product",
      showSorterTooltip: { title: "Сортировка по товару" },
      width: "400px",
      sorter: {
        compare: (a: any, b: any) =>
          a.product.product_name.localeCompare(b.product.product_name, "ru"),
      },
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
        const productName = record.product.product_name
          .toString()
          .toLowerCase();

        return filterBySearchText(searchValue, productName);
      },
      render: (text: IProduct) =>
        searchedColumn === "product_name" ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={
              text?.product_name ? text?.product_name.toString() : ""
            }
          />
        ) : (
          text?.product_name
        ),
    },
    {
      title: "Категория",
      dataIndex: "product",
      key: "product",
      showSorterTooltip: { title: "Сортировка по категории" },
      width: "150px",
      sorter: {
        compare: (a: any, b: any) =>
          a.product.product_group.product_group_name.localeCompare(
            b.product.product_group.product_group_name,
            "ru"
          ),
      },
      render: (text: IProduct) => text?.product_group?.product_group_name === 'Без категории' ? '-' :  text?.product_group?.product_group_name
    },
    {
      title: "Артикул",
      dataIndex: "product",
      key: "product",
      showSorterTooltip: { title: "Сортировка по артиклу" },
      width: "150px",
      sorter: {
        compare: (a: any, b: any) =>
          a.product?.product_article?.localeCompare(
            b.product?.product_article,
            "ru"
          ),
      },
      render: (text: IProduct) => text?.product_article || "_"
    },
    {
      title: "Добавленный товар",
      dataIndex: "order_product_name",
      key: "order_product_name",
      showSorterTooltip: { title: "Сортировка по добавленному товару" },
      width: "400px",
      hidden:!hasOrderProductName,
      sorter: {
        compare: (a: any, b: any) =>
          a?.product?.order_product_name?.localeCompare(
            b?.product?.order_product_name,
            "ru"
          ),
      },
      filterDropdown: (props) => (
        <SearchFilter
          {...props}
          placeholder="Поиск по добавленному товару"
          searchText={searchText}
          searchedColumn={searchedColumn}
          dataIndex="order_product_name"
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
        const productName = record?.order_product_name
          ?.toString()
          .toLowerCase();

        return filterBySearchText(searchValue, productName as string);
      },
      render: (text: string) =>
        searchedColumn === "order_product_name" ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : (
          text
        ),
    },
    {
      title: "Ссылка на товар",
      dataIndex: "order_product_link",
      key: "order_product_link",
      width: "300px",
      hidden:!hasOrderProductLink,
      showSorterTooltip: { title: "Сортировка по ссылке товара" },
      sorter: {
        compare: (a: any, b: any) =>
          a?.product?.order_product_link?.localeCompare(
            b?.product?.order_product_link,
            "ru"
          ),
      },
      filterDropdown: (props) => (
        <SearchFilter
          {...props}
          placeholder="Поиск по ссылке"
          searchText={searchText}
          searchedColumn={searchedColumn}
          dataIndex="order_product_link"
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
        const productLink = record?.order_product_link
          ?.toString()
          .toLowerCase();

        return filterBySearchText(searchValue, productLink as string);
      },
      render: (text: string) =>
        searchedColumn === "order_product_link" ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : (
          text &&
          <a href={text} target="_blank" style={{color:colorText}}>Нажмите чтобы перейти</a>
        ),
    },

    {
      title: "Ед. измерения",
      dataIndex: "unit_measurement",
      key: "unit_measurement",
      width: "50px",
      showSorterTooltip: { title: "Сортировка по ед. измерения" },
      sorter: {
        compare: (a: any, b: any) =>
          a.unit_measurement?.unit_measurement.unit_measurement_name.localeCompare(
            b.unit_measurement?.unit_measurement.unit_measurement_name,
            "ru"
          ),
      },
      render: (unit_measurement: IUnit) =>
        unit_measurement?.unit_measurement?.unit_measurement_name,
      responsive: ["sm"],
      filters: unitGroup as { text: string; value: number }[],
      onFilter: (value, record) =>
        record.unit_measurement.unit_measurement.unit_measurement_id === value,
    },
    {
      title: "Количество",
      dataIndex: "product_quantity",
      key: "product_quantity",
      width: "50px",
      showSorterTooltip: { title: "Сортировка по количеству" },
      sorter: {
        compare: (a: any, b: any) => a.count - b.count,
      },
      responsive: ["sm"],
    },
    {
      title: "Врач",
      dataIndex: "buyers",
      key: "buyers",
      width: "300px",
      hidden:!hasBuyers,
      render: (buyers: IEmployeeFromParlorGetMe[]) =>
        buyers.map((buyer) => buyer.buyer_name).join(", "),
      responsive: ["sm"],
    },
    {
      title: "Примечание",
      dataIndex: "note",
      width: "150px",
      key: "note",
      hidden:!hasNote,
      responsive: ["sm"],
    },
    {
      title: "Статус товара",
      dataIndex: "order_product_status",
      key: "order_product_status",
      // responsive: ["sm"],
      width: "150px",
      render: (order_product_status: IOrderProductStatus) => (
        <p
          style={{
            backgroundColor: order_product_status?.product_status_name,
            color: "#fff",
            padding: "10px",
            textAlign: "center",
            textTransform: "uppercase",
            borderRadius: "5px",
          }}
        >
          {order_product_status?.product_status_name}
        </p>
      ),
    },
    {
      title: "Действия",
      key: "action",

      render: (record: IProductTable) =>
        !isPrinting && (
          <Space size="middle">
            {record.is_cancel && (
              <Tooltip
                title={<span>{record.order_cancel_comment.comment}</span>}
              >
                <InfoCircleFilled style={{ color: "#fff" }} />
              </Tooltip>
            )}

            {!disabledOrder && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                <Button
                  onClick={() => {
                    setProductId(
                      record.product
                        ? (record.product.product_id as number)
                        : NaN
                    );
                    showModal();
                    setIsNewProduct(record.order_product_name ? true : false);
                    // @ts-ignore: Unreachable code error
                    setProductIndex(record.key);
                  }}
                  title="Изменить"
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
                  title="Удалить"
                >
                  Удалить
                </Button>
              </div>
            )}
          </Space>
        ),
    },
  ];

  const [currentFilters, setCurrentFilters] = useState<number>(
    productTableData?.length as number
  );

  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);

  // Обработчик раскрытия строки
  const handleExpand = async (expanded: boolean, record: IProductTable) => {
    // @ts-ignore: Unreachable code error
    const key = record.key as number;
    setExpandedRowKeys(
      (prev) =>
        expanded
          ? [...prev, key] // Добавляем ключ при раскрытии
          : prev.filter((k) => k !== key) // Удаляем ключ при сворачивании
    );
  };

  const dataSource = productTableData?.map((product, index) => ({
    ...product,
    key: index, // Ensure each item has a unique key
  }));

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      scroll={{ x: 200 }}
      pagination={
        isPrinting
          ? false // отключаем пагинацию при печати
          : {
              locale: { items_per_page: "/ Товаров" },
            }
      }
      footer={() => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p>
            Всего:{" "}
            {currentFilters
              ? currentFilters
              : dataSource?.length
              ? dataSource?.length
              : 0}
          </p>
          {!isPrinting && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Button onClick={() => exportToExcel()} title="Выгрузить в Excel">
                <FileExcelFilled
                  style={{ color: "#10793F", fontSize: "18px" }}
                />
              </Button>
              <Button onClick={handlePrint}>
                <PrinterOutlined style={{ fontSize: "18px" }} />
              </Button>
            </div>
          )}
        </div>
      )}
      onChange={(pagination, filters, sorter, extra) => {
        setCurrentFilters(extra.currentDataSource.length);
      }}
      rowClassName={(record) =>
        record?.is_cancel === true
          ? style.highlightRowIsCancel
          : record?.product?.product_group?.product_group_id !==
            orderProductGroup?.value && !record?.order_product_link
          ? style.highlightRowMatchCategory
          : ""
      }
      locale={{ emptyText: "Нет товаров" }}
      expandable={{
        expandedRowKeys,
        onExpand: handleExpand,
        expandedRowRender: (record) => (
          <>
            <ExpandedRowContent
              orderProductComments={record?.order_product_comment || []}
              productPreviousOrders={record?.product_previous_orders}
              orderId={orderId}
            />

            <RemainProduct product_kod_1c={record?.product?.product_kod_1c} />
          </>
        ),
      }}
      rowHoverable={false}
    />
  );
};

export default ProductOrderTable;
