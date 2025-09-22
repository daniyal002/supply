"use client";

import { Button, Space, Switch, Table, TableColumnsType } from "antd";
import { IEmployee } from "@/interface/employee";
import { EnumOrderTypes, IOrderItem } from "@/interface/orderItem";
import { IDepartment } from "@/interface/department";
import { useOrderIdStore } from "../../../../store/orderIdStore";
import { EyeTwoTone, SearchOutlined, SyncOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import SearchFilter from "@/helper/TableFilters/Filters/SearchFilter";
import { useSearch } from "@/helper/TableFilters/hook/useSearch";
import { useMemo, useState } from "react";
import { IProductGroup } from "@/interface/product";
import { IOrderStatus } from "@/interface/orderStatus";
import { IUser } from "@/interface/user";

interface OrderListProps {
  OrderData: IOrderItem[] | undefined;
  loading: boolean;
  refetch: () => void;
  isAllOrder: boolean;
  setIsAllOrder: (isAllOrder: boolean) => void;
}

const OrderListAllTable: React.FC<OrderListProps> = ({
  OrderData,
  loading,
  refetch,
  isAllOrder,
  setIsAllOrder,
}) => {
  const { searchText, searchedColumn, searchInput, handleSearch, handleReset } =
    useSearch();

  const setAllOrderId = useOrderIdStore((state) => state.setAllOrderId);

  const columns: TableColumnsType<IOrderItem> = [
    {
      title: "№",
      dataIndex: "order_number",
      key: "order_number",
      showSorterTooltip: { title: "Сортировка по номеру" },
      sorter: (a: IOrderItem, b: IOrderItem) =>
        a.order_number.localeCompare(b.order_number, "ru"),
      defaultSortOrder: "descend",
      filterDropdown: (props) => (
        <SearchFilter
          {...props}
          placeholder="Поиск по номеру"
          searchText={searchText}
          searchedColumn={searchedColumn}
          dataIndex="order_number"
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
      onFilter: (value, record) =>
        record.order_number
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase()),
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
      render: (text) => {
        const formattedOrderNumber = text
          ? text.toString().replace(/^0+/, "")
          : "";
        return searchedColumn === "order_number" ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={formattedOrderNumber}
          />
        ) : (
          formattedOrderNumber
        );
      },
    },
    {
      title: "Дата",
      dataIndex: "created_at",
      showSorterTooltip: { title: "Сортировка по дате" },
      key: "created_at",
      sorter: (a: IOrderItem, b: IOrderItem) => {
        const nameA = a.created_at || "";
        const nameB = b.created_at || "";
        return nameA.localeCompare(nameB, "ru");
      },
      render: (text: string) => {
        const date = new Date(text);
        return date.toLocaleString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
      },
    },
    {
      title: "Статус",
      showSorterTooltip: { title: "Сортировка по статусу" },
      dataIndex: "order_status",
      key: "order_status",
      sorter: (a: IOrderItem, b: IOrderItem) =>
        a.order_status.status_name.localeCompare(
          b.order_status.status_name,
          "ru"
        ),
      render: (order_status: IOrderStatus) => (
        <p
          style={{
            backgroundColor: order_status.status_color,
            color: "#fff",
            padding: "10px",
            textAlign: "center",
            textTransform: "uppercase",
            borderRadius: "5px",
          }}
        >
          {order_status?.status_name}
        </p>
      ),
      filters: OrderData
        ? Array.from(
            new Set(OrderData.map((order) => order?.order_status?.status_id))
          ).map((id) => {
            const orderStatus = OrderData.find(
              (order) => order?.order_status?.status_id === id
            )?.order_status;
            return {
              value: String(orderStatus?.status_id),
              text: orderStatus?.status_name || "",
            };
          })
        : [],
      onFilter: (value, record) =>
        record.order_status.status_id === Number(value),
      filterSearch: true,
    },
    {
      title: "Сотрудник/Кабинет",
      dataIndex: "buyer",
      showSorterTooltip: { title: "Сортировка по сотруднику" },
      key: "buyer",
      sorter: (a: IOrderItem, b: IOrderItem) => {
        const nameA = a.buyer?.buyer_name || "";
        const nameB = b.buyer?.buyer_name || "";
        return nameA.localeCompare(nameB, "ru");
      },
      responsive: ["lg"],
      filterDropdown: (props) => (
        <SearchFilter
          {...props}
          placeholder="Поиск по сотруднику"
          searchText={searchText}
          searchedColumn={searchedColumn}
          dataIndex="buyer"
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
      onFilter: (value, record) =>
        record.buyer?.buyer_name
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase()) || false,
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
      render: (buyer: IEmployee) => {
        return searchedColumn === "buyer" ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={buyer?.buyer_name}
          />
        ) : (
          buyer?.buyer_name
        );
      },
    },
    {
      title: "Подразделение",
      dataIndex: "department",
      showSorterTooltip: { title: "Сортировка по подразделению" },
      key: "department",
      sorter: (a: IOrderItem, b: IOrderItem) => {
        const nameA = a.department?.department_name || "";
        const nameB = b.department?.department_name || "";
        return nameA.localeCompare(nameB, "ru");
      },
      filters: OrderData
        ? Array.from(
            new Set(OrderData.map((order) => order?.department?.department_id))
          ).map((id) => {
            const orderDepatment = OrderData.find(
              (order) => order?.department?.department_id === id
            )?.department;
            return {
              value: String(orderDepatment?.department_id),
              text: orderDepatment?.department_name || "",
            };
          })
        : [],
      onFilter: (value, record) =>
        record.department?.department_id === Number(value),
      filterSearch: true,
      filterMode: "menu",
      render: (department: IDepartment) => department?.department_name,
    },
    {
      title: "Пользователь",
      dataIndex: "user",
      key: "user",
      showSorterTooltip: { title: "Сортировка по пользователю" },
      sorter: (a: IOrderItem, b: IOrderItem) => {
        const nameA = a.user?.employee.buyer_name || "";
        const nameB = b.user?.employee?.buyer_name || "";
        return nameA.localeCompare(nameB, "ru");
      },
      responsive: ["lg"],

      filterDropdown: (props) => (
        <SearchFilter
          {...props}
          placeholder="Поиск по пользователю"
          searchText={searchText}
          searchedColumn={searchedColumn}
          dataIndex="user"
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
      onFilter: (value, record) =>
        record.user?.employee.buyer_name
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase()) || false,
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
      render: (user: IUser) => {
        return searchedColumn === "user" ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={user?.employee.buyer_name}
          />
        ) : (
          user?.employee.buyer_name
        );
      },
    },
    {
      title: "Категория",
      dataIndex: "product_group",
      showSorterTooltip: { title: "Сортировка по категориям" },
      key: "product_group",
      sorter: (a: IOrderItem, b: IOrderItem) =>
        a.product_group.product_group_name.localeCompare(
          b.product_group.product_group_name,
          "ru"
        ),
      filters: OrderData
        ? Array.from(
            new Set(
              OrderData.map((order) => order?.product_group?.product_group_id)
            )
          ).map((id) => {
            const orderCategory = OrderData.find(
              (order) => order?.product_group?.product_group_id === id
            )?.product_group;
            return {
              value: String(orderCategory?.product_group_id),
              text: orderCategory?.product_group_name || "",
            };
          })
        : [],
      onFilter: (value, record) =>
        record.product_group.product_group_id === Number(value),
      filterSearch: true,

      render: (productGroup: IProductGroup) => productGroup?.product_group_name,
    },
    {
      title: "Тип заявки",
      dataIndex: "order_type",
      showSorterTooltip: { title: "Сортировка по типу заявки" },
      key: "order_type",
      sorter: (a: IOrderItem, b: IOrderItem) => {
        const nameA = a.order_type;
        const nameB = b.order_type;
        return nameA.localeCompare(nameB, "ru");
      },
      render: (orderType: string) =>
        orderType === "warehouse" ? "На склад" : "На закупку",
      filters: [
        { value: EnumOrderTypes.WAREHOUSE, text: "Заявка на склад" },
        { value: EnumOrderTypes.PURCHASE, text: "Заявка на закуп" },
      ],
      onFilter: (value, record) => record.order_type === value,
    },
    {
      title: "ОМС/ПУ",
      dataIndex: "oms",
      showSorterTooltip: { title: "Сортировка по ОМС/ПУ" },
      key: "oms",
      responsive: ["lg"],
      filters: [
        { value: "OMS", text: "ОМС" },
        { value: "PU", text: "ПУ" },
      ],
      onFilter: (value, record) => {
        // Предположим, что record.oms - это boolean
        if (value === "OMS") {
          return record.oms === true;
        }
        if (value === "PU") {
          return record.oms === false;
        }
        return false;
      },
      render: (oms) => (oms ? "ОМС" : "ПУ"),
    },
    {
      title: "Действия",
      key: "action",
      showSorterTooltip: { title: "Действия" },
      render: (_: any, record: IOrderItem) => (
        <Space size="middle">
          <Button
            onClick={() => setAllOrderId(String(record.order_id))}
            aria-label="Посмотреть заявку"
            title="Посмотреть заявку"
          >
            <EyeTwoTone />
          </Button>
        </Space>
      ),
    },
  ];

  const dataSource = OrderData?.map((order) => ({
    ...order,
    key: order.order_id, // Ensure each item has a unique key
  }));

  const [currentFilters, setCurrentFilters] = useState<number>(
    dataSource?.length as number
  );

  return (
    <>
      <Table
        title={() => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <p style={{ padding: 0 }}>
              Заявок: {currentFilters}
            </p>
            <Switch
              checkedChildren={"Все заявки"}
              unCheckedChildren={"Я Согласователь"}
              title={isAllOrder ? "Все заявки" : "Я Согласователь"}
              onChange={(e) => {
                setIsAllOrder(e);
              }}
            />
          </div>
        )}
        dataSource={dataSource}
        columns={columns}
        scroll={{ x: 200 }}
        pagination={{ locale: { items_per_page: "/ Заявок" } }}
        footer={() => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <p>
              Заявок: {currentFilters}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Button onClick={() => refetch()} title="Обновить заявки">
                <SyncOutlined />
              </Button>
            </div>
          </div>
        )}
        onRow={(record) => ({
          onDoubleClick: () => setAllOrderId(String(record.order_id)),
        })}
        onChange={(pagination, filters, sorter, extra) => {
          setCurrentFilters(extra.currentDataSource.length === 0 ? 0 : extra.currentDataSource.length);
        }}
        locale={{ emptyText: "Нет заявок" }}
        loading={loading}
      />
    </>
  );
};

export default OrderListAllTable;
