"use client";

import { Button, Space, Table, TableColumnsType } from "antd";
import { toast } from "sonner";
import { useMemo, useState, useEffect } from "react";
import { SearchOutlined, SyncOutlined } from "@ant-design/icons";

import { IStorage } from "@/interface/storage";
import {
  useArchiveStorageMutation,
  useDeleteStorageMutation,
} from "@/hook/storageHook";
import SearchFilter from "@/helper/TableFilters/Filters/SearchFilter";
import { useSearch } from "@/helper/TableFilters/hook/useSearch";
import Highlighter from "react-highlight-words";

interface Props {
  storageData: IStorage[] | undefined;
  onEdit: (id: number) => void;
  isArchive: boolean;
  refetch: () => void;
}

export default function StorageTable({
  storageData,
  onEdit,
  isArchive,
  refetch,
}: Props) {
  const { mutate: deleteStorage } = useDeleteStorageMutation();
  const { mutate: archiveStorage } = useArchiveStorageMutation();

  const { searchText, searchedColumn, searchInput, handleSearch, handleReset } =
    useSearch();

  const columns: TableColumnsType<IStorage> = [
    {
      title: "ID",
      dataIndex: "storage_id",
      key: "storage_id",
      sorter: (a, b) => a.storage_id - b.storage_id,
      defaultSortOrder: "descend",
      filterDropdown: (props) => (
        <SearchFilter
          {...props}
          placeholder="Поиск по ID"
          searchText={searchText}
          searchedColumn={searchedColumn}
          dataIndex="storage_id"
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
        (record.storage_id as number)
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
        return searchedColumn === "storage_id" ? (
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
    },
    {
      title: "Название",
      dataIndex: "storage_name",
      key: "storage_name",
      sorter: (a, b) => a.storage_name.localeCompare(b.storage_name, "ru"),
      defaultSortOrder: "descend",
      filterDropdown: (props) => (
        <SearchFilter
          {...props}
          placeholder="Поиск по названию"
          searchText={searchText}
          searchedColumn={searchedColumn}
          dataIndex="storage_name"
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
        record.storage_name
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
        return searchedColumn === "storage_name" ? (
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
    },
    {
      title: "1C код",
      dataIndex: "storage_1c_code",
      key: "storage_1c_code",
      sorter: (a, b) => a.storage_name.localeCompare(b.storage_name, "ru"),
      showSorterTooltip: { title: "Сортировка по коду 1С" },
      defaultSortOrder: "descend",
      filterDropdown: (props) => (
        <SearchFilter
          {...props}
          placeholder="Поиск по ID"
          searchText={searchText}
          searchedColumn={searchedColumn}
          dataIndex="storage_1c_code"
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
        record.storage_1c_code
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
        return searchedColumn === "storage_1c_code" ? (
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
    },
    {
      title: "OMS",
      dataIndex: "oms",
      key: "oms",
      render: (v: boolean) => (v ? "Да" : "Нет"),
      filters: [
        {
          text: "Да",
          value: true,
        },
        {
          text: "НЕТ",
          value: false,
        },
      ],
      onFilter: (value, record) => record.oms === value,
    },
    {
      title: "Действия",
      key: "action",
      render: (_: any, record: IStorage) => (
        <Space>
          <Button onClick={() => onEdit(record.storage_id)}>Изменить</Button>

          <Button
            danger
            onClick={() =>
              toast.error("Удалить склад?", {
                action: {
                  label: "Удалить",
                  onClick: () => deleteStorage(record),
                },
              })
            }
          >
            Удалить
          </Button>

          <Button onClick={() => archiveStorage(record)}>
            {record.is_archive ? "Разархивировать" : "Архивировать"}
          </Button>
        </Space>
      ),
    },
  ];

  const dataSource = useMemo(() => {
    return storageData
      ?.map((s) => ({ ...s, key: s.storage_id }))
      .filter((s) => s.is_archive === isArchive);
  }, [storageData, isArchive]);

  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(dataSource?.length || 0);
  }, [dataSource]);

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      pagination={{ pageSize: 10 }}
      title={() => <div>Складов: {count}</div>}
      footer={() => (
        <Button onClick={refetch}>
          <SyncOutlined /> Обновить
        </Button>
      )}
    />
  );
}
