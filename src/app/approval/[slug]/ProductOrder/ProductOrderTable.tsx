import { IEmployeeFromParlorGetMe } from "@/interface/employee";
import { IProduct } from "@/interface/product";
import { IProductTable } from "@/interface/productTable";
import { IUnit } from "@/interface/unit";
import { Button, Space, Table, TableColumnsType, Tooltip } from "antd";
import { useMemo, useState } from "react";
import { ExpandedRowContent } from "./ExpandedRowContent";
import { useDeleteOrderProductCancelCommentMutation } from "@/hook/orderHook";
import style from "./ProductOrderTable.module.scss"
import { FileExcelFilled, InfoCircleFilled, PrinterOutlined, SearchOutlined } from "@ant-design/icons";
import { RemainProduct } from "@/components/UI/RemainProduct/RemainProduct";
import SearchFilter from "@/helper/TableFilters/Filters/SearchFilter";
import { useSearch } from "@/helper/TableFilters/hook/useSearch";
import { filterBySearchText } from "@/helper/TableFilters/Filters/filterBySearchText";
import Highlighter from "react-highlight-words";

interface productOrderTableProps {
  productTableData: IProductTable[] | undefined;
  showModal: () => void;
  showModalCancel: () => void;
  setOrderProductId: (product: number) => void;
  setOrderProductIdCancel: (product: number) => void;
  setProductId: (product: number) => void;
  setProductIdCancel: (product: number) => void;
  setProductIndex: (key: number) => void;
  setProductIndexCancel: (key: number) => void;
  deleteProduct: (key: number) => void;
  orderId: number;
  readonly?:boolean
  exportToExcel: () => void
  handlePrint: () => void;
  isPrinting: boolean;
}

const ProductOrderTable: React.FC<productOrderTableProps> = ({
  productTableData,
  setOrderProductId,
  setOrderProductIdCancel,
  setProductId,
  setProductIdCancel,
  showModal,
  showModalCancel,
  setProductIndex,
  setProductIndexCancel,
  orderId,
  readonly = false,
  exportToExcel,
  handlePrint,
  isPrinting
}) => {
  const { mutate: deleteOrderProductCancelCommentMutation } =
    useDeleteOrderProductCancelCommentMutation(orderId);
     const { searchText, searchedColumn, searchInput, handleSearch, handleReset } =
        useSearch();

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
                text: product?.unit_measurement?.unit_measurement?.unit_measurement_name,
              }));
          }, [productTableData]);

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
        <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined, fontSize:"18px" }} />
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
      title: "Добавленный товар",
      dataIndex: "order_product_name",
      key: "order_product_name",
      showSorterTooltip: { title: "Сортировка по добавленному товару" },
      width: "400px",
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
        <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined, fontSize:"18px" }} />
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
      title: "Ссылка товар",
      dataIndex: "order_product_link",
      key: "order_product_link",
      showSorterTooltip: { title: "Сортировка по ссылке товара" },
      width: "400px",
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
        <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined, fontSize:"18px" }} />
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
          text
        ),
    },


    {
      title: "Ед. измерения",
      dataIndex: "unit_measurement",
      key: "unit_measurement",
      showSorterTooltip: { title: "Сортировка по ед. измерения" },
      width: "50px",
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
      showSorterTooltip: { title: "Сортировка по количеству" },
      width: "50px",
      sorter: {
        compare: (a: any, b: any) => a.count - b.count,
      },
      responsive: ["sm"],
    },
    {
      title: "Врач",
      dataIndex: "buyers",
      width: "300px",
      key: "buyers",
      render: (buyers: IEmployeeFromParlorGetMe[]) =>
        buyers.map((buyer) => buyer.buyer_name).join(", "),
      responsive: ["sm"],
    },
    {
      title: "Примечание",
      dataIndex: "note",
      width: "150px",
      key: "note",
      responsive: ["sm"],
    },
    {
      title: "Действия",
      key: "action",
      width: "100px",
      render: (_: any, record: IProductTable) => (
        !isPrinting &&
        <Space size="middle">
          {record.is_cancel ? (
            <>
            <Button
              onClick={() =>
                deleteOrderProductCancelCommentMutation({
                  cancel_comment_id:
                    record.order_cancel_comment.comment_cancel_id,
                  order_product_id: record.order_product_id as number,
                })
              }
        title="Активировать"
            >
              Активировать
            </Button>
            <Tooltip title={<span>{record.order_cancel_comment.comment}</span>}>
            <InfoCircleFilled  style={{color:"#fff"}}/>
            </Tooltip>
            </>
          ) : (
            <Button
              onClick={() => {
                showModalCancel();
                setProductIdCancel(record.product.product_id);
                setOrderProductIdCancel(record.order_product_id as number);
                // @ts-ignore: Unreachable code error
                setProductIndexCancel(record.key);
              }}
        title="Отклонить"
            >
              Отклонить
            </Button>
          )}
        </Space>
      ),
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
      pagination={
        isPrinting
          ? false // отключаем пагинацию при печати
          : {
              locale: { items_per_page: "/ Товаров" },
            }
      }
      rowClassName={(record) => record.is_cancel === true ? style.highlightRow : ''}
      expandable={{
        expandedRowKeys,
        onExpand: handleExpand,
        expandedRowRender: (record) =>
          record.order_product_comment && (
            <>
            <ExpandedRowContent
            orderProductComments={record.order_product_comment}
            productPreviousOrders={record.product_previous_orders}
              product_id={record.product.product_id}
              order_product_id={record.order_product_id as number}
              setOrderProductId={setOrderProductId}
              setProductId={setProductId}
              setProductIndex={setProductIndex}
              showModal={showModal}
              orderId={orderId}
              is_cancel={record.is_cancel as boolean}
              readonly={readonly}
            />
            <RemainProduct product_kod_1c={record.product.product_kod_1c}/>
            </>
          ),
      }}
      rowHoverable={false}
      footer={() => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p>Всего: {productTableData?.length}</p>
          {!isPrinting && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Button onClick={() => exportToExcel()} title="Выгрузить в Excel">
            <FileExcelFilled style={{color:"#10793F", fontSize:"18px"}}/>
            </Button>
            <Button onClick={handlePrint}>
              <PrinterOutlined style={{ fontSize: "18px" }} />
            </Button>
          </div>
          )}
        </div>
      )}
      rowKey="order_product_id"
    />
  );
};

export default ProductOrderTable;
