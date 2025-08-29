"use client";

import { Button, Space, Table, TableColumnsType } from "antd";
import { toast } from "sonner";
import { IEmployee } from "@/interface/employee";
import { IDraftOrderItem, IOrderItem } from "@/interface/orderItem";
import { IDepartment } from "@/interface/department";
import { useOrderIdStore } from "../../../../store/orderIdStore";
import {
  DeleteFilled,
  EyeTwoTone,
  SearchOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import SearchFilter from "@/helper/TableFilters/Filters/SearchFilter";
import StatusFilter from "@/helper/TableFilters/Filters/StatusFilter";
import CheckboxFilter from "@/helper/TableFilters/Filters/CheckboxFilter";
import { useSearch } from "@/helper/TableFilters/hook/useSearch";
import { useState } from "react";
import { IProductGroup } from "@/interface/product";
import { useDeleteDraftOrderByIdMutation } from "@/hook/orderTempHook";
import { IOrderStatus } from "@/interface/orderStatus";

interface OrderListProps {
  OrderData: IDraftOrderItem[] | undefined;
  loading: boolean;
  refetch: () => void;
}

const DraftOrderListTable: React.FC<OrderListProps> = ({
  OrderData,
  loading,
  refetch,
}) => {
  const { searchText, searchedColumn, searchInput, handleSearch, handleReset } =
    useSearch();
  const StatusOption = OrderData
    ? Array.from(
        new Set(OrderData.map((order) => order?.order_status?.status_id))
      ).map((id) => {
        const orderStatus = OrderData.find(
          (order) => order?.order_status?.status_id === id
        )?.order_status;
        return {
          value: String(orderStatus?.status_id),
          label: orderStatus?.status_name || "",
        };
      })
    : [];

  const CategoryOption = OrderData
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
          label: orderCategory?.product_group_name || "",
        };
      })
    : [];

  const { mutate: deleteDraftOrderByIdMutation } =
    useDeleteDraftOrderByIdMutation();
  const setDraftOrderId = useOrderIdStore((state) => state.setDraftOrderId);
  const columns: TableColumnsType<IDraftOrderItem> = [
    {
      title: "№",
      dataIndex: "order_temp_id",
      key: "order_temp_id",
      showSorterTooltip: { title: "Сортировка по номеру" },
      sorter: (a: IDraftOrderItem, b: IDraftOrderItem) =>
        Number(a.order_temp_id) - Number(b.order_temp_id),
      defaultSortOrder: "descend",
      filterDropdown: (props) => (
        <SearchFilter
          {...props}
          placeholder="Поиск по номеру"
          searchText={searchText}
          searchedColumn={searchedColumn}
          dataIndex="order_temp_id"
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
        Number(record.order_temp_id)
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
        return searchedColumn === "order_temp_id" ? (
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
      sorter: (a: IDraftOrderItem, b: IDraftOrderItem) => {
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
      sorter: (a: IDraftOrderItem, b: IDraftOrderItem) => {
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
      render: (department: IDepartment) => department?.department_name,
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
      render: (_: any, record: IDraftOrderItem) => (
        <Space size="middle">
          <Button
            onClick={() => setDraftOrderId(String(record.order_temp_id))}
            aria-label="Посмотреть заявку"
            title="Посмотреть заявку"
          >
            <EyeTwoTone />
          </Button>
          <Button
            aria-label="Удалить черновик"
            title="Удалить черновик"
            type="primary"
            danger
            onClick={() =>
              toast.error("Вы точно хотите удалить черновик ?", {
                style: {
                  color: "red",
                },
                action: {
                  label: "Удалить",
                  onClick: () =>
                    deleteDraftOrderByIdMutation({
                      order_temp_id: record.order_temp_id as number,
                    }),
                },
              })
            }
          >
            <DeleteFilled />
          </Button>
        </Space>
      ),
    },
  ];

  const dataSource = OrderData?.map((order) => ({
    ...order,
    key: order.order_temp_id, // Ensure each item has a unique key
  }));

  const [currentFilters, setCurrentFilters] = useState<number>(
    dataSource?.length as number
  );

  return (
    <Table
      title={() => (
        <p style={{ padding: 0 }}>
          Заявок: {currentFilters ? currentFilters : dataSource?.length}
        </p>
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
          <p>Заявок: {currentFilters ? currentFilters : dataSource?.length}</p>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Button onClick={() => refetch()} title="Обновить заявки">
              <SyncOutlined />
            </Button>
          </div>
        </div>
      )}
      onRow={(record) => ({
        onDoubleClick: () => setDraftOrderId(String(record.order_temp_id)),
      })}
      onChange={(pagination, filters, sorter, extra) => {
        setCurrentFilters(extra.currentDataSource.length);
      }}
      locale={{ emptyText: "Нет черновиков" }}
      loading={loading}
    />
  );
};

export default DraftOrderListTable;
