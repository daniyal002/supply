'use client';

import { Button, Space, Table, TableColumnsType } from "antd";
import { toast } from "sonner";
import { IUser } from "@/interface/user";
import { useDeleteUserMutation } from "@/hook/userHook";
import { IEmployee } from "@/interface/employee";
import { IRole } from "@/interface/role";

interface userTableProps {
  userData: IUser[] | undefined;
  onEdit: (id: number) => void;
}

const UserTable: React.FC<userTableProps> = ({ userData, onEdit }) => {
  const { mutate: deleteUserMutation } = useDeleteUserMutation();

  const columns: TableColumnsType<IUser> = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        sorter: (a:any, b:any) => a.id - b.id,
      },
      {
        title: 'Пользователь',
        dataIndex: 'login',
        key: 'login',
        sorter: (a: any, b: any) => a.login.localeCompare(b.login, 'ru'),
      },
      {
        title: 'Сотрудник',
        dataIndex: 'employee',
        key: 'employee',
        sorter: (a:IUser, b:IUser) => a.employee.buyer_name.localeCompare(b.employee.buyer_name, 'ru'),
        render: (employee:IEmployee) => employee.buyer_name
      },
      
      {
        title: 'Роль',
        dataIndex: 'role',
        key: 'role',
        sorter: (a: any, b: any) => a.role.role_name.localeCompare(b.role.role_name, 'ru'),
        render: (role:IRole) => role?.role_name
      },
    {
      title: "Действия",
      key: "action",
      render: (_: any, record: IUser) => (
        <Space size="middle">
          <Button type="dashed" onClick={() => onEdit(record.id as number)}>
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
    key: user.id, // Ensure each item has a unique key
  }));

  return <Table dataSource={dataSource} columns={columns} />;
};

export default UserTable;
