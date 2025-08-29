"use client";

import { Button, Space, Table, TableColumnsType } from "antd";
import { toast } from "sonner";
import { IRole } from "@/interface/role";
import { useArchiveRoleMutation, useDeleteRoleMutation } from "@/hook/roleHook";
import SearchFilter from "@/helper/TableFilters/Filters/SearchFilter";
import { useSearch } from "@/helper/TableFilters/hook/useSearch";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

interface RoleTableProps {
  roleData: IRole[] | undefined;
  onEdit: (id: number) => void;
  isArchive: boolean;
}

const RoleTable: React.FC<RoleTableProps> = ({
  roleData,
  onEdit,
  isArchive,
}) => {
  const { mutate: deleteRoleMutation } = useDeleteRoleMutation();
  const { mutate: archiveRoleMutation } = useArchiveRoleMutation();
  const { searchText, searchedColumn, searchInput, handleSearch, handleReset } =
      useSearch();

  const columns: TableColumnsType<IRole> = [
    {
      title: "ID",
      dataIndex: "role_id",
      key: "role_id",
      sorter: (a: any, b: any) => a.role_id - b.role_id,
      showSorterTooltip: { title: "Сортировка по ID" },
      defaultSortOrder: "descend",
      filterDropdown: (props) => (
        <SearchFilter
          {...props}
          placeholder="Поиск по ID"
          searchText={searchText}
          searchedColumn={searchedColumn}
          dataIndex="role_id"
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
      (record.role_id as number)
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase()),
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
      render: (text) => {
        const formattedID = text
          ? text.toString().replace(/^0+/, "")
          : "";
        return searchedColumn === "role_id" ? (
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
      title: "Роль",
      dataIndex: "role_name",
      key: "role_name",
      sorter: (a: any, b: any) => a.role_name.localeCompare(b.role_name, "ru"),
    },
    {
      title: "Роль",
      dataIndex: "note",
      key: "note",
      sorter: (a: any, b: any) => a.note.localeCompare(b.note, "ru"),
    },
    {
      title: "Действия",
      key: "action",
      render: (_: any, record: IRole) => (
        <Space size="middle">
          <Button
            type="dashed"
            onClick={() => onEdit(record.role_id as number)}
            title="Изменить"
          >
            Изменить
          </Button>
          <Button
            type="primary"
            danger
            onClick={() =>
              toast.error("Вы точно хотите удалить должность ?", {
                style: {
                  color: "red",
                },
                action: {
                  label: "Удалить",
                  onClick: () => deleteRoleMutation(record),
                },
              })
            }
            title="Удалить"
          >
            Удалить
          </Button>
          <Button onClick={() => archiveRoleMutation(record)}>
            {record.is_archive ? "Разархивировать" : "Архивировать"}
          </Button>
        </Space>
      ),
    },
  ];

  const dataSource = roleData
    ?.map((role) => ({
      ...role,
      key: role.role_id, // Ensure each item has a unique key
    }))
    .filter((role) => role.is_archive === isArchive);

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      pagination={{ locale: { items_per_page: "/ Ролей" } }}
      scroll={{ x: 200 }}
    />
  );
};

export default RoleTable;
