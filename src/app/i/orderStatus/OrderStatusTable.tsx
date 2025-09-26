"use client";

import { Button, ColorPicker, Space, Table, TableColumnsType } from "antd";
import { toast } from "sonner";
import { useSearch } from "@/helper/TableFilters/hook/useSearch";
import SearchFilter from "@/helper/TableFilters/Filters/SearchFilter";
import { SearchOutlined, SyncOutlined } from "@ant-design/icons";
import { Key, useEffect, useMemo, useState } from "react";
import { filterBySearchText } from "@/helper/TableFilters/Filters/filterBySearchText";
import Highlighter from "react-highlight-words";
import { EnumStatusType, IOrderStatus } from "@/interface/orderStatus";
import { useDeleteOrderStatusMutation } from "@/hook/orderStatusHook";

interface OrderStatusTableProps {
  orderStatusData: IOrderStatus[] | undefined;
  onEdit: (id: number) => void;
  isArchive: boolean;
  refetch: () => void;
}

const OrderStatusTable: React.FC<OrderStatusTableProps> = ({
  orderStatusData,
  onEdit,
  isArchive,
  refetch,
}) => {
  const { mutate: deleteOrderStatusMutation } = useDeleteOrderStatusMutation();
  // const {mutate: archivePostMutation} = useArchivePostMutation()
  const { searchText, searchedColumn, searchInput, handleSearch, handleReset } =
    useSearch();

  const columns: TableColumnsType<IOrderStatus> = [
    {
      title: "ID",
      dataIndex: "status_id",
      key: "status_id",
      sorter: (a: any, b: any) => a.status_id - b.status_id,
      showSorterTooltip: { title: "Сортировка по ID" },
      defaultSortOrder: "ascend",
      filterDropdown: (props) => (
        <SearchFilter
          {...props}
          placeholder="Поиск по ID"
          searchText={searchText}
          searchedColumn={searchedColumn}
          dataIndex="status_id"
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
        (record.status_id as number)
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase()),
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
      render: (text) => {
        const formattedID = text ? text.toString().replace(/^0+/, "") : "";
        return searchedColumn === "status_id" ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={formattedID}
          />
        ) : (
          formattedID
        );
      },
      width:50
    },
    {
      title: "Статус",
      dataIndex: "status_name",
      key: "status_name",
      sorter: (a: any, b: any) =>
        a.status_name.localeCompare(b.status_name, "ru"),
      showSorterTooltip: { title: "Сортировка по статусу" },
      filterDropdown: (props: any) => (
        <SearchFilter
          {...props}
          placeholder="Поиск по должности"
          searchText={searchText}
          searchedColumn={searchedColumn}
          dataIndex="status_name"
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
      onFilter: (value: boolean | Key, record: IOrderStatus) => {
        const searchValue = (value as string).toLowerCase();
        const status_name = record.status_name.toString().toLowerCase();

        return filterBySearchText(searchValue, status_name);
      },
      render: (text: string) =>
        searchedColumn === "status_name" ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : (
          text
        ),
      width:250
    },
    {
      title: "Цвет",
      dataIndex: "status_color",
      key: "status_color",
      render: (status_color: string) => (
        <ColorPicker value={status_color} disabled />
      ),
      width:100
    },
    {
      title: "Тип статуса",
      dataIndex: "status_type",
      key: "status_type",
      sorter: (a: IOrderStatus, b: IOrderStatus) => {
        const nameA = a.status_type;
        const nameB = b.status_type;
        return nameA.localeCompare(nameB, "ru");
      },
      render: (statusType: string) =>
        statusType === "unf" ? "1С УНФ" : "Снабжение",
      filters: [
        { value: EnumStatusType.UNF, text: "1С УНФ" },
        { value: EnumStatusType.SNAB, text: "Снабжение" },
      ],
      onFilter: (value, record) => record.status_type === value,
      width:200
    },
    {
      title: "Примечание",
      dataIndex: "note",
      key: "note",
      width:300
    },
    {
      title: "Действия",
      key: "action",
      render: (_: any, record: IOrderStatus) => (
        <Space size="middle">
          <Button
            type="dashed"
            onClick={() => onEdit(record.status_id as number)}
            title="Изменить"
          >
            Изменить
          </Button>
          <Button
            type="primary"
            danger
            onClick={() =>
              toast.error("Вы точно хотите удалить статус ?", {
                style: {
                  color: "red",
                },
                action: {
                  label: "Удалить",
                  onClick: () =>
                    deleteOrderStatusMutation({
                      status_id: record.status_id as number,
                    }),
                },
              })
            }
            title="Удалить"
          >
            Удалить
          </Button>
        </Space>
      ),
      width:200
    },
  ];

  const dataSource = useMemo(() => {
    return orderStatusData?.map((status) => ({
      ...status,
      key: status.status_id, // Ensure each item has a unique key
    }));
  }, [orderStatusData, isArchive]);

  const [currentFilters, setCurrentFilters] = useState<number>(
    dataSource?.length as number
  );

  useEffect(() => {
    setCurrentFilters(dataSource?.length as number);
  }, [orderStatusData, isArchive]);
  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      pagination={{ locale: { items_per_page: "/ Должностей" } }}
      scroll={{ x: 200 }}
      title={() => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p style={{ padding: 0 }}>Статусов: {currentFilters ?? 0}</p>
        </div>
      )}
      footer={() => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p>Статусов: {currentFilters ?? 0}</p>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Button onClick={() => refetch()} title="Обновить статусы">
              <SyncOutlined />
            </Button>
          </div>
        </div>
      )}
      onChange={(pagination, filters, sorter, extra) => {
        setCurrentFilters(
          extra.currentDataSource.length === 0
            ? 0
            : extra.currentDataSource.length
        );
      }}
    />
  );
};

export default OrderStatusTable;
