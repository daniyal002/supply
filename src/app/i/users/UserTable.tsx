"use client";

import { Button, Space, Table, TableColumnsType } from "antd";
import { toast } from "sonner";
import { IUser, IUserOnline } from "@/interface/user";
import { useArchiveUserMutation, useDeleteUserMutation } from "@/hook/userHook";
import { IEmployee } from "@/interface/employee";
import { IRole } from "@/interface/role";
import SearchFilter from "@/helper/TableFilters/Filters/SearchFilter";
import { MessageOutlined, SearchOutlined, SyncOutlined } from "@ant-design/icons";
import { filterBySearchText } from "@/helper/TableFilters/Filters/filterBySearchText";
import { useSearch } from "@/helper/TableFilters/hook/useSearch";
import Highlighter from "react-highlight-words";
import { useRoleData } from "@/hook/roleHook";
import { formatNotificationDate } from "@/helper/DataFormat";
import { useEffect, useMemo, useState } from "react";

interface userTableProps {
  userData: IUserOnline[] | undefined;
  onEdit: (id: number) => void;
  isArchive:boolean
  setBuyerId: (id: number) => void;
  setIsModalMessageOpen: (open: boolean) => void;
  refetch: () => void;
}

const UserTable: React.FC<userTableProps> = ({ userData, onEdit, isArchive,setBuyerId,setIsModalMessageOpen,refetch }) => {
  const { mutate: deleteUserMutation } = useDeleteUserMutation();
  const { searchText, searchedColumn, searchInput, handleSearch, handleReset } =
    useSearch();
  const { roleData } = useRoleData();

  const {mutate:archiveUserMutation} = useArchiveUserMutation()

  const openModalMessage = (buyerId: number) => {
    setBuyerId(buyerId);
    setIsModalMessageOpen(true);
  };

  const columns: TableColumnsType<IUserOnline> = [
    {
      title: "ID",
      dataIndex: "user_id",
      key: "user_id",
      sorter: (a: any, b: any) => a.user_id - b.user_id,
      defaultSortOrder: "descend",
      filterDropdown: (props) => (
        <SearchFilter
          {...props}
          placeholder="Поиск по ID"
          searchText={searchText}
          searchedColumn={searchedColumn}
          dataIndex="user_id"
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
      (record.user_id as number)
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
        return searchedColumn === "user_id" ? (
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
      title: "Пользователь",
      dataIndex: "login",
      key: "login",
      sorter: (a: any, b: any) => a.login.localeCompare(b.login, "ru"),
      filterDropdown: (props) => (
        <SearchFilter
          {...props}
          placeholder="Поиск по пользователю"
          searchText={searchText}
          searchedColumn={searchedColumn}
          dataIndex="login"
          searchInput={searchInput}
          handleSearch={handleSearch}
          handleReset={handleReset}
        />
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined, fontSize:"18px" }} />
      ),
      onFilter: (value, record) => {
        const searchValue = (value as string).toLowerCase();
        const login = record.login.toString().toLowerCase();

        return filterBySearchText(searchValue, login);
      },
      render: (text) =>
        searchedColumn === "login" ? (
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
      title: "Сотрудник",
      dataIndex: "employee",
      key: "employee",
      sorter: (a: IUser, b: IUser) =>
        a.employee.buyer_name.localeCompare(b.employee.buyer_name, "ru"),
      render: (employee: IEmployee) =>
        searchedColumn === "buyer_name" ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={employee.buyer_name}
          />
        ) : (
          employee.buyer_name
        ),
      filterDropdown: (props) => (
        <SearchFilter
          {...props}
          placeholder="Поиск по сотруднику"
          searchText={searchText}
          searchedColumn={searchedColumn}
          dataIndex="buyer_name"
          searchInput={searchInput}
          handleSearch={handleSearch}
          handleReset={handleReset}
        />
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined, fontSize:"18px" }} />
      ),
      onFilter: (value, record) => {
        const searchValue = (value as string).toLowerCase();
        const buyer_name = record.employee.buyer_name.toString().toLowerCase();

        return filterBySearchText(searchValue, buyer_name);
      },
    },

    {
      title: "Роль",
      dataIndex: "role",
      key: "role",
      sorter: (a: any, b: any) =>
        a.role.role_name.localeCompare(b.role.role_name, "ru"),
      render: (role: IRole) => role?.note,
      filters: roleData?.map((role) => ({
        text: role.role_name,
        value: role.role_id,
      })) as { text: string; value: number }[],
      onFilter: (value, record) => record.role?.role_id === value,
    },
    {
      title:"Онлайн",
      dataIndex:"is_online",
      key:"is_online",
      render: (is_online: boolean) => (
        <span style={{ color: is_online ? "green" : "red" }}>
          {is_online ? `Да` : "Нет"}
        </span>
      ),
      filters: [{ text: "Да", value: true }, { text: "Нет", value: false }],
      onFilter: (value, record) => record.is_online === value,
    },
    {
      title: "Последний вход",
      dataIndex: "connected_at",
      key: "connected_at",
      render: (connected_at: string) => connected_at ? formatNotificationDate(connected_at) : "-"
    },
    {
      title: "Действия",
      key: "action",
      render: (_: any, record: IUserOnline) => (
        <Space size="middle">
          <Button
            type="dashed"
            onClick={() => onEdit(record.user_id as number)}
            title="Изменить"
          >
            Изменить
          </Button>
          <Button
            type="primary"
            danger
            onClick={() =>
              toast.error("Вы точно хотите удалить пользователя ?", {
                style: {
                  color: "red",
                },
                action: {
                  label: "Удалить",
                  onClick: () => deleteUserMutation(record),
                },
              })
            }
            title="Удалить"
          >
            Удалить
          </Button>
          <Button onClick={() => archiveUserMutation(record)}>
            {record.is_archive ? "Разархивировать" : "Архивировать"}
          </Button>
          {record.is_online && (
            <Button
              type="default"
              onClick={() => openModalMessage(record.employee.buyer_id as number)}
              title="Отправить сообщение"
              icon={<MessageOutlined/>}
            />
          )}
        </Space>
      ),
    },
  ];


  const dataSource = useMemo(() => {
    return userData?.map((user) => ({
      ...user,
      key: user.user_id, // Ensure each item has a unique key
    })).filter((user) => user.is_archive === isArchive);
  }, [userData, isArchive])

   const [currentFilters, setCurrentFilters] = useState<number>(
      dataSource?.length as number
    );

    useEffect(() => {
      setCurrentFilters(dataSource?.length as number)
    },[userData, isArchive])

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      pagination={{ locale: { items_per_page: "/ Пользователей" } }}
      scroll={{ x: 200 }}
      title={() => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p style={{ padding: 0 }}>
           Пользователей: {currentFilters ?? 0}
          </p>
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
          <p>
          Пользователей: {currentFilters ?? 0}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Button onClick={() => refetch()} title="Обновить пользователей">
              <SyncOutlined />
            </Button>
          </div>
        </div>
      )}
      onChange={(pagination, filters, sorter, extra) => {
        setCurrentFilters(extra.currentDataSource.length === 0 ? 0 : extra.currentDataSource.length);
      }}
    />
  );
};

export default UserTable;
