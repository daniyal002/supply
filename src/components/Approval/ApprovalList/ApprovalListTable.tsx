"use client";

import { Button, ConfigProvider, Space, Table, TableColumnsType } from "antd";
import { IEmployee } from "@/interface/employee";
import { IOrderItem, IStatusOrder } from "@/interface/orderItem";
import { IDepartment } from "@/interface/department";
import { EyeTwoTone, SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { useApprovalStore } from "../../../../store/approvalStore";
import { useSearch } from "@/helper/TableFilters/hook/useSearch";
import SearchFilter from "@/helper/TableFilters/Filters/SearchFilter";
import StatusFilter from "@/helper/TableFilters/Filters/StatusFilter";
import CheckboxFilter from "@/helper/TableFilters/Filters/CheckboxFilter";
import { IUser } from "@/interface/user";

interface ApprovalListProps {
  OrderData: IOrderItem[] | undefined;
}

const ApprovalListTable: React.FC<ApprovalListProps> = ({ OrderData }) => {
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

  const setApprovalOrderId = useApprovalStore(
    (state) => state.setApprovalOrderId
  );
  const columns: TableColumnsType<IOrderItem> = [
    {
      title: "№",
      dataIndex: "order_number",
      key: "order_number",
      sorter: (a: any, b: any) =>
        a.order_number.localeCompare(b.order_number, "ru"),
      filterDropdown: (props) => (
        <SearchFilter
          {...props}
          searchText={searchText}
          searchedColumn={searchedColumn}
          dataIndex="order_number"
          searchInput={searchInput}
          handleSearch={handleSearch}
          handleReset={handleReset}
        />
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
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
      render: (text) =>
        searchedColumn === "order_number" ? (
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
      title: "Дата",
      dataIndex: "created_at",
      key: "created_at",
      sorter: (a: any, b: any) =>
        a.created_at.localeCompare(b.created_at, "ru"),
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
      dataIndex: "order_status",
      key: "order_status",
      sorter: (a: any, b: any) =>
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
      key: "buyer",
      sorter: (a: any, b: any) =>
        a.buyer.buyer_name.localeCompare(b.buyer.buyer_name, "ru"),
      render: (buyer: IEmployee) => buyer?.buyer_name,
      responsive: ["lg"],
    },
    {
      title: "Пользователь",
      dataIndex: "user",
      key: "user",
      showSorterTooltip: { title: "Сортировка по пользователю" },
      sorter: (a: any, b: any) =>
        a.user?.employee.buyer_name.localeCompare(
          b.user?.employee.buyer_name,
          "ru"
        ),
      responsive: ["lg"],
      render: (user: IUser) => {
        return user?.employee.buyer_name;
      },
    },
    {
      title: "Подразделение",
      dataIndex: "department",
      key: "department",
      sorter: (a: any, b: any) =>
        a.department_name.localeCompare(b.department_name, "ru"),
      render: (department: IDepartment) => department?.department_name,
    },
    {
      title: "ОМС/ПУ",
      dataIndex: "oms",
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
      render: (_: any, record: IOrderItem) => (
        <Space size="middle">
          <Button onClick={() => setApprovalOrderId(String(record.order_id))}>
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
            (dataSource?.length as number) > 0 ? dataSource?.length : 0
          }`
        }
      />
    </ConfigProvider>
  );
};

export default ApprovalListTable;
