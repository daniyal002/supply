"use client";

import { Button, ColorPicker, Space, Table, TableColumnsType } from "antd";
import { toast } from "sonner";
import { useSearch } from "@/helper/TableFilters/hook/useSearch";
import SearchFilter from "@/helper/TableFilters/Filters/SearchFilter";
import { SearchOutlined } from "@ant-design/icons";
import { Key } from "react";
import { filterBySearchText } from "@/helper/TableFilters/Filters/filterBySearchText";
import Highlighter from "react-highlight-words";
import { IOrderStatus } from "@/interface/orderStatus";
import { useDeleteOrderStatusMutation } from "@/hook/orderStatusHook";

interface OrderStatusTableProps {
  orderStatusData: IOrderStatus[] | undefined;
  onEdit: (id: number) => void;
  isArchive: boolean;
}

const OrderStatusTable: React.FC<OrderStatusTableProps> = ({
  orderStatusData,
  onEdit,
  isArchive,
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
    },
    {
      title: "Цвет",
      dataIndex: "status_color",
      key: "status_color",
      render: (status_color: string) => (
        <ColorPicker value={status_color} disabled />
      ),
    },
    {
      title: "Примечание",
      dataIndex: "note",
      key: "note",
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
          {/* <Button onClick={() => archivePostMutation(record)}>
            {record.is_archive ? "Разархивировать" : "Архивировать"}
          </Button> */}
        </Space>
      ),
    },
  ];

  const dataSource = orderStatusData?.map((status) => ({
    ...status,
    key: status.status_id, // Ensure each item has a unique key
  }));

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      pagination={{ locale: { items_per_page: "/ Должностей" } }}
      scroll={{ x: 200 }}
    />
  );
};

export default OrderStatusTable;
