'use client';

import { Button, Space, Table, TableColumnsType } from "antd";
import { toast } from "sonner";
import { IUser } from "@/interface/user";
import { useDeleteUserMutation } from "@/hook/userHook";
import { IEmployee } from "@/interface/employee";
import { IRole } from "@/interface/role";
import SearchFilter from "@/helper/TableFilters/Filters/SearchFilter";
import { SearchOutlined } from "@ant-design/icons";
import { filterBySearchText } from "@/helper/TableFilters/Filters/filterBySearchText";
import { useSearch } from "@/helper/TableFilters/hook/useSearch";
import Highlighter from "react-highlight-words";
import { useRoleData } from "@/hook/roleHook";

interface userTableProps {
  userData: IUser[] | undefined;
  onEdit: (id: number) => void;
}

const UserTable: React.FC<userTableProps> = ({ userData, onEdit }) => {
  const { mutate: deleteUserMutation } = useDeleteUserMutation();
  const { searchText, searchedColumn, searchInput, handleSearch, handleReset } = useSearch();
  const {roleData} = useRoleData()

  const columns: TableColumnsType<IUser> = [
    {
        title: 'ID',
        dataIndex: 'user_id',
        key: 'user_id',
        sorter: (a:any, b:any) => a.user_id - b.user_id,
      },
      {
        title: 'Пользователь',
        dataIndex: 'login',
        key: 'login',
        sorter: (a: any, b: any) => a.login.localeCompare(b.login, 'ru'),
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
          <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
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
        title: 'Сотрудник',
        dataIndex: 'employee',
        key: 'employee',
        sorter: (a:IUser, b:IUser) => a.employee.buyer_name.localeCompare(b.employee.buyer_name, 'ru'),
        render: (employee:IEmployee) =>
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
          <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
        ),
        onFilter: (value, record) => {
          const searchValue = (value as string).toLowerCase();
          const buyer_name = record.employee.buyer_name.toString().toLowerCase();

          return filterBySearchText(searchValue, buyer_name);
        },
      },

      {
        title: 'Роль',
        dataIndex: 'role',
        key: 'role',
        sorter: (a: any, b: any) => a.role.role_name.localeCompare(b.role.role_name, 'ru'),
        render: (role:IRole) => role?.role_name,
        filters: roleData?.map(role => ({
          text: role.role_name,
          value: role.role_id
        })) as { text: string; value: number }[],
        onFilter: (value, record) =>
          record.role?.role_id === value,
      },
    {
      title: "Действия",
      key: "action",
      render: (_: any, record: IUser) => (
        <Space size="middle">
          <Button type="dashed" onClick={() => onEdit(record.user_id as number)}>
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
          >
            Удалить
          </Button>
        </Space>
      ),
    },
  ];

  const dataSource = userData?.map((user) => ({
    ...user,
    key: user.user_id, // Ensure each item has a unique key
  }));

  return <Table dataSource={dataSource} columns={columns} pagination={{locale:{items_per_page:"/ Пользователей"} }}/>;
};

export default UserTable;
