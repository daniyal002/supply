import { Card, Pagination, Typography, Input, Select, Button } from "antd";
import { useEffect, useState } from "react";
import OrderCard from "./OrderCard";
import { IOrderItem } from "@/interface/orderItem";
import styles from "./OrderCardWrapper.module.scss";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  SyncOutlined,
} from "@ant-design/icons";

const { Option } = Select;

interface OrderCardWrapperProps {
  OrderData: IOrderItem[] | undefined;
  loading: boolean;
  refetch: () => void;
  isDraft: boolean;
}

const getOrderCardKey = (order: IOrderItem, index: number) => {
  const draftOrderId = (order as IOrderItem & { order_temp_id?: number }).order_temp_id;

  return (
    order.order_id ??
    draftOrderId ??
    order.order_number ??
    `order-card-${index}`
  );
};

const OrderCardWrapper: React.FC<OrderCardWrapperProps> = ({
  OrderData,
  loading,
  refetch,
  isDraft,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [searchText, setSearchText] = useState("");
  const [sortField, setSortField] = useState<keyof IOrderItem | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [paginatedData, setPaginatedData] = useState<IOrderItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);

  // Пересчитываем данные при изменении фильтров или сортировки
  useEffect(() => {
    if (!OrderData) return;

    let filteredData = [...OrderData];

    // Фильтрация по номеру заказа
    if (searchText) {
      filteredData = filteredData.filter((order) =>
        order.order_number.toString().includes(searchText)
      );
    }

    if (sortField) {
      filteredData.sort((a, b) => {
        const fieldA =
          sortField === "order_status"
            ? a.order_status?.status_name
            : a[sortField];
        const fieldB =
          sortField === "order_status"
            ? b.order_status?.status_name
            : b[sortField];

        if (typeof fieldA === "string" && typeof fieldB === "string") {
          return sortOrder === "asc"
            ? fieldA.localeCompare(fieldB, "ru")
            : fieldB.localeCompare(fieldA, "ru");
        }

        if (typeof fieldA === "number" && typeof fieldB === "number") {
          return sortOrder === "asc" ? fieldA - fieldB : fieldB - fieldA;
        }

        return 0;
      });
    }

    // Установите общее количество элементов
    setTotalItems(filteredData.length);

    // Пагинация
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setPaginatedData(filteredData.slice(startIndex, endIndex));
  }, [OrderData, currentPage, pageSize, searchText, sortField, sortOrder]);

  // Сброс пагинации при изменении фильтров
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, sortField, sortOrder]);

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize !== undefined && pageSize !== pageSize) {
      setPageSize(pageSize);
    }
  };

  return (
    <div className={styles.orderListWrapper}>
      {/* Блок управления */}
      <div className={styles.controls}>
        {!isDraft && (
          <Input
            placeholder="Поиск по номеру"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            className={styles.searchInput}
          />
        )}

        <div className={styles.sortSelectWrapper}>
          <Select
            placeholder="Сортировать по"
            value={sortField || undefined}
            onChange={(value) => {
              //@ts-ignore
              if (value === "") {
                setSortField(null);
              } else {
                setSortField(value);
              }
            }}
            className={styles.sortSelect}
          >
            <Option value="">Без сортировки</Option>
            {!isDraft && (
              <>
                <Option value="order_number">Номер</Option>
                <Option value="order_status">Статус</Option>
              </>
            )}
            <Option value="created_at">Дата</Option>
          </Select>

          {sortField && (
            <Button
              icon={
                sortOrder === "asc" ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )
              }
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className={styles.sortButton}
            />
          )}
        </div>
        <Button
          icon={<SyncOutlined />}
          onClick={refetch}
          loading={loading}
          className={styles.refreshButton}
        >
          Обновить
        </Button>
      </div>

      {loading ? (
        <Card loading />
      ) : paginatedData.length > 0 ? (
        <>
          <div className={styles.orderCardsGrid}>
            {paginatedData.map((order, index) => (
              <OrderCard
                key={getOrderCardKey(order, index)}
                order={order}
                isDraft={isDraft}
              />
            ))}
          </div>

          <div className={styles.paginationContainer}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalItems} // Используйте новое значение
              onChange={handlePageChange}
              showSizeChanger
              // showQuickJumper
              locale={{ items_per_page: "на странице" }}
            />
          </div>
        </>
      ) : (
        <Card>
          <Typography.Text type="secondary">
            Нет доступных заявок
          </Typography.Text>
        </Card>
      )}
    </div>
  );
};

export default OrderCardWrapper;
