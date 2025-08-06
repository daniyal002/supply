"use client";

import {
  Button,
  Input,
  Popconfirm,
  Space,
  Table,
  TableColumnsType,
} from "antd";
import { toast } from "sonner";
import { IEmployee } from "@/interface/employee";
import { IOrderItem } from "@/interface/orderItem";
import { IDepartment } from "@/interface/department";
import {
  useArchiveOrderMutation,
  useForceSubmitOrderTo1cMutation,
  useResetOrderMutation,
} from "@/hook/orderHook";
import { useOrderIdStore } from "../../../store/orderIdStore";
import {
  EyeTwoTone,
  FileZipOutlined,
  ReloadOutlined,
  SearchOutlined,
  SendOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import SearchFilter from "@/helper/TableFilters/Filters/SearchFilter";
import StatusFilter from "@/helper/TableFilters/Filters/StatusFilter";
import CheckboxFilter from "@/helper/TableFilters/Filters/CheckboxFilter";
import { useSearch } from "@/helper/TableFilters/hook/useSearch";
import { IUser } from "@/interface/user";
import { useState } from "react";
import { IOrderStatus } from "@/interface/orderStatus";
import { IProductGroup } from "@/interface/product";

interface AdminOrderListProps {
  OrderData: IOrderItem[] | undefined;
  isArchive: boolean;
}

const AdminOrderListTable: React.FC<AdminOrderListProps> = ({
  OrderData,
  isArchive,
}) => {
  const { searchText, searchedColumn, searchInput, handleSearch, handleReset } =
    useSearch();

  const { mutate: forceSubmitOrderTo1c } = useForceSubmitOrderTo1cMutation();
  const { mutate: archiveOrderMutation } = useArchiveOrderMutation();

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

  const { mutate: resetOrderMutation } = useResetOrderMutation();
  const setAdminOrderId = useOrderIdStore((state) => state.setAdminOrderId);

  const [archiveNote, setArchiveNote] = useState<string>();

  const handleConfirm = (order_id: number) => {
    archiveOrderMutation({ order_id, archive_note: String(archiveNote) });
    setArchiveNote(""); // Очистить поле
  };

  const handleCancel = () => {
    setArchiveNote(""); // Очистить поле при отмене
  };

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
          placeholder="Статус"
        />
      ),
      onFilter: (value, record) =>
        record.order_status.status_id === Number(value),
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
      render: (user: IUser) => {
        return user?.employee.buyer_name;
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
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <StatusFilter
          options={CategoryOption}
          setSelectedKeys={setSelectedKeys}
          selectedKeys={selectedKeys.map((key) => String(key))}
          confirm={confirm}
          clearFilters={() => clearFilters && clearFilters()}
          placeholder="Статус"
        />
      ),
      onFilter: (value, record) =>
        record.product_group.product_group_id === Number(value),
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
      render: (_: any, record: IOrderItem) => (
        <Space size="middle">
          <Button
            onClick={() => setAdminOrderId(String(record.order_id))}
            aria-label="Посмотреть заявку"
            title="Посмотреть заявку"
          >
            <EyeTwoTone />
          </Button>

          <Button
            onClick={() =>
              forceSubmitOrderTo1c({ order_id: record.order_id as number })
            }
            aria-label="Отправить в 1С УНФ"
            title="Отправить в 1С УНФ"
          >
            <SendOutlined />
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
                    onClick: () =>
                      resetOrderMutation(record.order_id as number),
                  },
                })
              }
            >
              <ReloadOutlined />
            </Button>
          )}

          <Popconfirm
            title={record.is_archive ? "Разархивировать ?" : "Архивировать ?"}
            description={() =>
              record.is_archive ? (
                ""
              ) : (
                <Input
                  placeholder="Введите причину архивации"
                  value={archiveNote}
                  onChange={(e) => setArchiveNote(e.target.value)}
                />
              )
            }
            onConfirm={() => handleConfirm(record.order_id as number)} // Обернули в функцию
            onCancel={handleCancel}
            okText="Да"
            cancelText="Нет"
          >
            <Button danger
            title={record.is_archive ? "Разархивировать" : "Архивировать"}
            >
              <FileZipOutlined />
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const dataSource = OrderData?.map((order) => ({
    ...order,
    key: order.order_id, // Ensure each item has a unique key
  })).filter((order) => order.is_archive === isArchive);

  return (
    <Table
      title={() => (
        <p style={{ padding: 0 }}>
          Заявок: {(dataSource?.length as number) > 0 ? dataSource?.length : 0}
        </p>
      )}
      dataSource={dataSource}
      columns={columns}
      scroll={{ x: 200 }}
      pagination={{ locale: { items_per_page: "/ Заявок" } }}
      footer={() =>
        `Заявок: ${(dataSource?.length as number) > 0 ? dataSource?.length : 0}`
      }
      onRow={(record) => ({
        onDoubleClick: () => setAdminOrderId(String(record.order_id)),
      })}
    />
  );
};

export default AdminOrderListTable;
