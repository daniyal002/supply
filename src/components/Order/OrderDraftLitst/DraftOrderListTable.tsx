"use client";

import { Button, ConfigProvider, Space, Table, TableColumnsType } from "antd";
import { toast } from "sonner";
import { IEmployee } from "@/interface/employee";
import { IDraftOrderItem, IOrderItem, IStatusOrder } from "@/interface/orderItem";
import { IDepartment } from "@/interface/department";
import { useResetOrderMutation } from "@/hook/orderHook";
import { useOrderIdStore } from "../../../../store/orderIdStore";
import { DeleteFilled, EyeTwoTone, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import SearchFilter from "@/helper/TableFilters/Filters/SearchFilter";
import StatusFilter from "@/helper/TableFilters/Filters/StatusFilter";
import CheckboxFilter from "@/helper/TableFilters/Filters/CheckboxFilter";
import { useSearch } from "@/helper/TableFilters/hook/useSearch";
import { useState } from "react";
import { IProductGroup } from "@/interface/product";
import { useDeleteDraftOrderByIdMutation } from "@/hook/orderTempHook";

interface OrderListProps {
  OrderData: IDraftOrderItem[] | undefined;
}

const DraftOrderListTable: React.FC<OrderListProps> = ({ OrderData }) => {
  const { searchText, searchedColumn, searchInput, handleSearch, handleReset } =
    useSearch();
  const StatusOption = OrderData
    ? Array.from(
        new Set(OrderData.map((order) => order?.order_status?.order_status_id))
      ).map((id) => {
        const orderStatus = OrderData.find(
          (order) => order?.order_status?.order_status_id === id
        )?.order_status;
        return {
          value: String(orderStatus?.order_status_id),
          label: orderStatus?.order_status_name || "",
        };
      })
    : [];

  const { mutate: deleteDraftOrderByIdMutation } = useDeleteDraftOrderByIdMutation();
  const setDraftOrderId = useOrderIdStore((state) => state.setDraftOrderId);
  const columns: TableColumnsType<IDraftOrderItem> = [
    {
      title: "№",
      dataIndex: "order_temp_id",
      key: "order_temp_id",
      showSorterTooltip: { title: "Сортировка по номеру" },
      sorter: (a: IDraftOrderItem, b: IDraftOrderItem) => Number(a.order_temp_id) - Number(b.order_temp_id),
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
        <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
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
        a.order_status.order_status_name.localeCompare(
          b.order_status.order_status_name,
          "ru"
        ),
      render: (order_status: IStatusOrder) => order_status?.order_status_name,
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <StatusFilter
          options={StatusOption}
          setSelectedKeys={setSelectedKeys}
          selectedKeys={selectedKeys.map((key) => String(key))}
          confirm={confirm}
          clearFilters={() => clearFilters && clearFilters()}
        />
      ),
      onFilter: (value, record) =>
        record.order_status.order_status_id === Number(value),
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
        <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
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
      render: (department: IDepartment) => department?.department_name,
    },
    {
      title: "Категория",
      dataIndex: "product_group",
      showSorterTooltip: { title: "Сортировка по категориям" },
      key: "product_group",
      sorter: (a: IDraftOrderItem, b: IDraftOrderItem) =>
        a.product_group.product_group_name.localeCompare(
          b.product_group.product_group_name,
          "ru"
        ),
      render: (productGroup: IProductGroup) => productGroup?.product_group_name,
    },
    {
      title: "ОМС/ПУ",
      dataIndex: "oms",
      showSorterTooltip: { title: "Сортировка по ОМС/ПУ" },
      key: "oms",
      // sorter: (a: any, b: any) => a?.post?.post_name?.localeCompare(b?.post?.post_name, 'ru'),
      responsive: ["lg"],
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <CheckboxFilter
          setSelectedKeys={setSelectedKeys}
          selectedKeys={selectedKeys.map((key) => String(key))}
          confirm={confirm}
          clearFilters={() => clearFilters && clearFilters()}
        />
      ),
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
                      deleteDraftOrderByIdMutation({order_temp_id:record.order_temp_id as number}),
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
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#678098",
        },
      }}
    >
      <Table
        dataSource={dataSource}
        columns={columns}
        scroll={{ x: 200 }}
        pagination={{ locale: { items_per_page: "/ Заявок" } }}
        footer={() =>
          `Заявок: ${
            currentFilters ? currentFilters : dataSource?.length
          }`
        }
        onChange={(pagination, filters, sorter, extra) => {
          setCurrentFilters(extra.currentDataSource.length);
        }}
        locale={{emptyText:"Нет черновиков"}}
      />


    </ConfigProvider>
  );
};

export default DraftOrderListTable;
