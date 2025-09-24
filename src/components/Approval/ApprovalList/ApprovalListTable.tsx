"use client";

import { Button, Space, Table, TableColumnsType } from "antd";
import { IEmployee } from "@/interface/employee";
import { EnumOrderTypes, IOrderItem } from "@/interface/orderItem";
import { IDepartment } from "@/interface/department";
import { EyeTwoTone, SearchOutlined, SyncOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { useApprovalStore } from "../../../../store/approvalStore";
import { useSearch } from "@/helper/TableFilters/hook/useSearch";
import SearchFilter from "@/helper/TableFilters/Filters/SearchFilter";
import { IUser } from "@/interface/user";
import { useEffect, useMemo, useState } from "react";
import { IOrderStatus } from "@/interface/orderStatus";
import { IProductGroup } from "@/interface/product";
import { ProductNameList } from "@/components/UI/ProductNameList/ProductNameList";
import styles from './ApprovalListTable.module.scss'

interface ApprovalListProps {
  OrderData: IOrderItem[] | undefined;
  loading: boolean;
  refetch: () => void;
}

const ApprovalListTable: React.FC<ApprovalListProps> = ({
  OrderData,
  loading,
  refetch,
}) => {
  const { searchText, searchedColumn, searchInput, handleSearch, handleReset } =
    useSearch();

  const setApprovalOrderId = useApprovalStore(
    (state) => state.setApprovalOrderId
  );
  const columns: TableColumnsType<IOrderItem> = [
    {
      title: "№",
      dataIndex: "order_number",
      key: "order_number",
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
      key: "buyer",
      sorter: (a: IOrderItem, b: IOrderItem) => {
        const nameA = a.buyer?.buyer_name || "";
        const nameB = b.buyer?.buyer_name || "";
        return nameA.localeCompare(nameB, "ru");
      },
      render: (buyer: IEmployee) => buyer?.buyer_name,
      responsive: ["lg"],
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
      key: "oms",
      // sorter: (a: any, b: any) => a?.post?.post_name?.localeCompare(b?.post?.post_name, 'ru'),
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
      render: (_: any, record: IOrderItem) => (
        <Space size="middle">
          <Button onClick={() => setApprovalOrderId(String(record.order_id))}>
            <EyeTwoTone />
          </Button>
        </Space>
      ),
    },
  ];

  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);

  const handleExpand = (expanded: boolean, record: IOrderItem) => {
    const key = record.order_id;
    let newExpandedRowKeys = [...expandedRowKeys];

    if (expanded) {
      newExpandedRowKeys.push(key as number);
    } else {
      newExpandedRowKeys = newExpandedRowKeys.filter((k) => k !== key);
    }

    setExpandedRowKeys(newExpandedRowKeys);
  };

  const dataSource = useMemo(() => {
    return OrderData?.map((order) => ({
    ...order,
    key: order.order_id, // Ensure each item has a unique key
  }));
  }, [OrderData]);


  const [currentFilters, setCurrentFilters] = useState<number>(
    dataSource?.length as number
  );

   useEffect(() => {
      setCurrentFilters(dataSource?.length as number);
    }, [OrderData]);

  return (
    <Table
      title={() => (
        <p style={{ padding: 0 }}>
          Заявок: {currentFilters ?? 0}
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
          <p>Заявок: {currentFilters ?? 0}</p>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Button onClick={() => refetch()} title="Обновить заявки">
              <SyncOutlined />
            </Button>
          </div>
        </div>
      )}
      onRow={(record) => ({
        onDoubleClick: () => setApprovalOrderId(String(record.order_id)),
      })}
      onChange={(pagination, filters, sorter, extra) => {
        setCurrentFilters(
          extra.currentDataSource.length === 0
            ? 0
            : extra.currentDataSource.length
        );
      }}
      locale={{ emptyText: "Нет заявок" }}
      loading={loading}
      expandable={{
        expandedRowKeys,
        onExpand: handleExpand,
        expandedRowRender: (record) => {
          return (
            <div className={styles.productContainer}>
              <ProductNameList orderId={record.order_id as number} expandedRowKeys={expandedRowKeys} />
            </div>
          );
        },
      }}
    />
  );
};

export default ApprovalListTable;
