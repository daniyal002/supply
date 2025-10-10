import { IProduct } from "@/interface/product";
import { IEmployeeFromProductTable, IProductTable } from "@/interface/productTable";
import { IUnit } from "@/interface/unit";
import { Button, Space, Table, TableColumnsType, theme, Tooltip } from "antd";
import { useMemo, useState } from "react";
import { ExpandedRowContent } from "./ExpandedRowContent";
import { useDeleteOrderProductCancelCommentMutation } from "@/hook/orderHook";
import style from "./ProductOrderTable.module.scss";
import {
  FileExcelFilled,
  InfoCircleFilled,
  PrinterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { RemainProduct } from "@/components/UI/RemainProduct/RemainProduct";
import SearchFilter from "@/helper/TableFilters/Filters/SearchFilter";
import { useSearch } from "@/helper/TableFilters/hook/useSearch";
import { filterBySearchText } from "@/helper/TableFilters/Filters/filterBySearchText";
import Highlighter from "react-highlight-words";
import { useProductData } from "@/hook/productHook";
import { UseFormWatch } from "react-hook-form";
import { IOrderItemFormValues } from "@/interface/orderItem";
import { useProductTableColumnVisibility } from "@/hook/useProductTableColumnVisibility";
import { IOrderProductCommentsResponse } from "@/interface/orderProductComments";

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
  readonly?: boolean;
  exportToExcel: () => void;
  handlePrint: () => void;
  isPrinting: boolean;
  watch: UseFormWatch<IOrderItemFormValues>;
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
  isPrinting,
  watch,
}) => {
  const orderProductGroup = watch("product_group");
  const { mutate: deleteOrderProductCancelCommentMutation } =
    useDeleteOrderProductCancelCommentMutation(orderId);
  const { searchText, searchedColumn, searchInput, handleSearch, handleReset } =
    useSearch();

  const {
    hasOrderProductName,
    hasOrderProductLink,
    hasBuyers,
    hasNote,
    hasOrderProductComment,
  } = useProductTableColumnVisibility(productTableData);

  const {
    token: { colorText },
  } = theme.useToken();
  const { productData } = useProductData();

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

  const columns: TableColumnsType<IProductTable> = [
    {
      title: "Товар",
      dataIndex: "product",
      key: "product",
      showSorterTooltip: { title: "Сортировка по товару" },
      width: "400px",
      sorter: {
        compare: (a: IProductTable, b: IProductTable) =>
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
      render: (text: IProduct) =>
        text?.product_group?.product_group_name === "Без категории"
          ? "-"
          : text?.product_group?.product_group_name,
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
      render: (text: IProduct) => text?.product_article || "_",
    },
    {
      title: "Добавленный товар",
      dataIndex: "order_product_name",
      key: "order_product_name",
      showSorterTooltip: { title: "Сортировка по добавленному товару" },
      width: "400px",
      hidden: !hasOrderProductName,
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
      title: "Ссылка товар",
      dataIndex: "order_product_link",
      key: "order_product_link",
      showSorterTooltip: { title: "Сортировка по ссылке товара" },
      width: "400px",
      hidden: !hasOrderProductLink,
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
          text && (
            <a href={text} target="_blank" style={{ color: colorText }}>
              Нажмите чтобы перейти
            </a>
          )
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
      title: "Согласованное количество",
      dataIndex: "order_product_comment",
      key: "order_product_comment",
      width: "250px",
      sorter: {
        compare: (a: any, b: any) => a.count - b.count,
      },
      render: (orderProductComment: IOrderProductCommentsResponse[]) => {
        if (!orderProductComment || orderProductComment.length === 0) {
          return null;
        }
        const latestComment = orderProductComment[0];
        return (
          <div style={{ fontSize: "12px" }}>
            <p style={{ margin: 0 }}>
              <strong>Количество:</strong> {latestComment.product_count}
            </p>
            <p style={{ margin: 0 }}>
              <strong>Комментарий:</strong>{" "}
              {latestComment.comment && latestComment.comment.length > 50 ? (
                <Tooltip title={latestComment.comment}>
                  {`${latestComment.comment.substring(0, 50)}...`}
                </Tooltip>
              ) : (
                latestComment.comment
              )}
            </p>
            <p style={{ margin: 0 }}>
              <strong>Сотрудник:</strong> {latestComment.employee}
            </p>
          </div>
        );
      },
      hidden: !hasOrderProductComment,
      responsive: ["sm"],
    },
    {
      title: "Общий остаток",
      dataIndex: "remainder",
      key: "remainder",
      showSorterTooltip: { title: "Сортировка по количеству" },
      width: "50px",
      sorter: {
        compare: (a: any, b: any) => a.remainder - b.remainder,
      },
      responsive: ["sm"],
      render: (value: number, record) =>
        productData?.find(
          (product) => product.product_id === record.product.product_id
        )?.remainder || "_",
    },
    {
      title: "Врач",
      dataIndex: "buyers",
      width: "300px",
      key: "buyers",
      hidden: !hasBuyers,
      render: (buyers: IEmployeeFromProductTable[]) =>
        buyers
          ?.map((buyer) =>
            buyer.product_quantity === 0
              ? buyer.buyer_name
              : buyer.buyer_name + " - " + buyer.product_quantity
          )
          .join(", "),
      responsive: ["sm"],
    },
    {
      title: "Примечание",
      dataIndex: "note",
      width: "150px",
      key: "note",
      hidden: !hasNote,
      responsive: ["sm"],
    },
    {
      title: "Действия",
      key: "action",
      width: "100px",
      hidden: readonly,
      render: (_: any, record: IProductTable) =>
        !isPrinting &&
        !readonly && (
          <Space size="middle">
            {record.is_cancel ? (
              <>
                <Button
                  onClick={() =>
                    deleteOrderProductCancelCommentMutation({
                      cancel_comment_id: record?.order_cancel_comment
                        ?.comment_cancel_id as number,
                      order_product_id: record.order_product_id as number,
                    })
                  }
                  title="Активировать"
                >
                  Активировать
                </Button>
                <Tooltip
                  title={
                    <span>
                      {record?.order_cancel_comment?.comment}
                      <br /> Сотрудник: {record?.order_cancel_comment?.employee}
                    </span>
                  }
                >
                  <InfoCircleFilled style={{ color: "#fff" }} />
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
      rowClassName={(record) =>
        record?.is_cancel === true
          ? style.highlightRowIsCancel
          : record?.product?.product_group?.product_group_id !==
              orderProductGroup?.value && !record?.order_product_link
          ? style.highlightRowMatchCategory
          : ""
      }
      expandable={{
        expandedRowKeys,
        onExpand: handleExpand,
        expandedRowRender: (record) =>
          record.order_product_comment && (
            <>
              <ExpandedRowContent
                orderProductComments={record.order_product_comment}
                productPreviousOrders={record.product_previous_orders || []}
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
              <RemainProduct product_kod_1c={record.product.product_kod_1c} />
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
      rowKey="order_product_id"
    />
  );
};

export default ProductOrderTable;
