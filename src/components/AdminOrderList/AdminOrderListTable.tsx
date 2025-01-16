"use client";

import {
  Button,
  ConfigProvider,
  Space,
  Table,
  TableColumnsType,
} from "antd";
import { toast } from "sonner";
import { IEmployee } from "@/interface/employee";
import { IOrderItem, IStatusOrder } from "@/interface/orderItem";
import { IDepartment } from "@/interface/department";
import { useDeleteOrderMutation, useResetOrderMutation } from "@/hook/orderHook";
import { useOrderIdStore } from "../../../store/orderIdStore";
import { EyeTwoTone, ReloadOutlined, SearchOutlined, SyncOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import SearchFilter from "@/helper/TableFilters/Filters/SearchFilter";
import StatusFilter from "@/helper/TableFilters/Filters/StatusFilter";
import CheckboxFilter from "@/helper/TableFilters/Filters/CheckboxFilter";
import { useSearch } from "@/helper/TableFilters/hook/useSearch";

interface AdminOrderListProps {
  OrderData: IOrderItem[] | undefined;
}

const AdminOrderListTable: React.FC<AdminOrderListProps> = ({ OrderData }) => {

  const { searchText, searchedColumn, searchInput, handleSearch, handleReset } = useSearch();
  const StatusOption = OrderData
  ? Array.from(
      new Set(OrderData.map(order => order?.order_status?.order_status_id))
    ).map(id => {
      const orderStatus = OrderData.find(order => order?.order_status?.order_status_id === id)?.order_status;
      return { value: String(orderStatus?.order_status_id), label: orderStatus?.order_status_name || '' };
    })
  : [];

  const { mutate: resetOrderMutation } = useResetOrderMutation()
  const setAdminOrderId = useOrderIdStore((state) => state.setAdminOrderId);
  const columns: TableColumnsType<IOrderItem> = [
    {
      title: "№",
      dataIndex: "order_number",
      key: "order_number",
      showSorterTooltip: {title:"Сортировка по номеру"},
      sorter: (a: any, b: any) =>
        a.order_number.localeCompare(b.order_number, "ru"),
      defaultSortOrder: 'descend',
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
      render: (text) => {
        const formattedOrderNumber = text ? text.toString().replace(/^0+/, '') : "";
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
      showSorterTooltip: {title:"Сортировка по дате"},
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
        showSorterTooltip: {title:"Сортировка по статусу"},
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
            selectedKeys={selectedKeys.map(key => String(key))}
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
      showSorterTooltip: {title:"Сортировка по сотруднику"},
      key: "buyer",
      sorter: (a: any, b: any) =>
        a.buyer.buyer_name.localeCompare(b.buyer.buyer_name, "ru"),
      responsive: ["lg"],
      filterDropdown: (props) => (
        <SearchFilter
          {...props}
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
      showSorterTooltip: {title:"Сортировка по подразделению"},
      key: "department",
      sorter: (a: any, b: any) =>
        a.department_name.localeCompare(b.department_name, "ru"),
      render: (department: IDepartment) => department?.department_name,
    },
    {
      title: "ОМС/ПУ",
      dataIndex: "oms",
      showSorterTooltip: {title:"Сортировка по ОМС/ПУ"},
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
          selectedKeys={selectedKeys.map(key => String(key))}
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
      showSorterTooltip: {title:"Действия"},
      render: (_: any, record: IOrderItem) => (
        <Space size="middle">
          {/* <Link href={`/order/${record.order_id}`}>Изменить</Link> */}
          <Button onClick={() => setAdminOrderId(String(record.order_id))} aria-label="Посмотреть заявку" title="Посмотреть заявку" >
          <EyeTwoTone />
          </Button>
          {record.in_route && record.current_step_container !== null && (
            <Button
            aria-label="Сбросить заявку"
            title="Сбросить заявку"
            type="primary"
            danger
            onClick={() =>
              toast.error("Вы точно хотите сбросить заявку ?", {
                style: {
                  color: "red",
                },
                action: {
                  label: "Сбросить",
                  onClick: () => resetOrderMutation(record.order_id as number),
                },
              })
            }
          >
            <ReloadOutlined />
          </Button>
          )}
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
        colorPrimary:"#678098"
      },
    }}
  >
    <Table dataSource={dataSource} columns={columns} scroll={{ x: 200 }} pagination={{locale:{items_per_page:"/ Заявок"} }}/>
    </ConfigProvider>
  );
};

export default AdminOrderListTable;
