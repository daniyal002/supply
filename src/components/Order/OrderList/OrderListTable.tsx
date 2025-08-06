"use client";

import { Button, Space, Table, TableColumnsType } from "antd";
import { toast } from "sonner";
import { IEmployee } from "@/interface/employee";
import { IOrderItem } from "@/interface/orderItem";
import { IDepartment } from "@/interface/department";
import { useResetOrderMutation } from "@/hook/orderHook";
import { useOrderIdStore } from "../../../../store/orderIdStore";
import { EyeTwoTone, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import SearchFilter from "@/helper/TableFilters/Filters/SearchFilter";
import StatusFilter from "@/helper/TableFilters/Filters/StatusFilter";
import CheckboxFilter from "@/helper/TableFilters/Filters/CheckboxFilter";
import { useSearch } from "@/helper/TableFilters/hook/useSearch";
import { useState } from "react";
import ContextMenu from "@/components/UI/ContextMenu/ContextMenu";
import { useTabStore } from "../../../../store/tabStore";
import { IProductGroup } from "@/interface/product";
import { IOrderStatus } from "@/interface/orderStatus";

interface OrderListProps {
  OrderData: IOrderItem[] | undefined;
  loading:boolean
}

const OrderListTable: React.FC<OrderListProps> = ({ OrderData,loading }) => {
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
        new Set(OrderData.map((order) => order?.product_group?.product_group_id))
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

    // const optionsOrderTypes: { value: string; label: string }[] = [
    //     { value: EnumOrderTypes.WAREHOUSE, label: "Заявка на склад" },
    //     { value: EnumOrderTypes.PURCHASE, label: "Заявка на закуп" },
    //   ];

  const { mutate: resetOrderMutation } = useResetOrderMutation();
  const setOrderId = useOrderIdStore((state) => state.setOrderId);
  const addTabOrders = useTabStore((state) => state.addTabOrders);
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
        <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined, fontSize:"18px" }} />
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
        <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined, fontSize:"18px" }} />
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
            placeholder="Категория"
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
            onClick={() => setOrderId(String(record.order_id))}
            aria-label="Посмотреть заявку"
            title="Посмотреть заявку"
          >
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
                    onClick: () =>
                      resetOrderMutation(record.order_id as number),
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

  const [currentFilters, setCurrentFilters] = useState<number>(
    dataSource?.length as number
  );

  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    orderId: number | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    orderId: null,
  });

  const handleContextMenu = (event: React.MouseEvent, record: IOrderItem) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      orderId: record.order_id as number,
    });
  };

  const handleCopyOrder = () => {
    if (!contextMenu.orderId) return;

    // Логика создания копии
    toast.success("Копия заявки создана");
    setOrderId(`copy${String(contextMenu.orderId)}`);

    // Здесь вызовите вашу мутацию для копирования
  };

  return (

    <>
      <Table
      title={() => <p style={{padding:0}}>Заявок: {
            currentFilters ? currentFilters : dataSource?.length
          }</p>}
        dataSource={dataSource}
        columns={columns}
        scroll={{ x: 200 }}
        pagination={{ locale: { items_per_page: "/ Заявок" } }}
        footer={() =>
          `Заявок: ${
            currentFilters ? currentFilters : dataSource?.length
          }`
        }
        onRow={(record) => ({
          onContextMenu: (e) => handleContextMenu(e, record),
          onDoubleClick: () => setOrderId(String(record.order_id))
        })}
        onChange={(pagination, filters, sorter, extra) => {
          setCurrentFilters(extra.currentDataSource.length);
        }}
        locale={{emptyText:"Нет заявок"}}
        loading={loading}
      />

      <ContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        visible={contextMenu.visible}
        onClose={() => setContextMenu((prev) => ({ ...prev, visible: false }))}
        onCopy={handleCopyOrder}
      />
      </>
  );
};

export default OrderListTable;
