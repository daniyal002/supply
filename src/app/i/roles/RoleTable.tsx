'use client';

import { IPost } from "@/interface/post";
import { Button, Space, Table } from "antd";
import { toast } from "sonner";
import { useDeletePostMutation } from "@/hook/postHook";
import { IRole } from "@/interface/role";
import { useDeleteRoleMutation } from "@/hook/roleHook";

interface PostTableProps {
  roleData: IRole[] | undefined;
  onEdit: (id: number) => void;
}

const RoleTable: React.FC<PostTableProps> = ({ roleData, onEdit }) => {
  const { mutate: deleteRoleMutation } = useDeleteRoleMutation();

  const columns = [
    {
      title: "ID",
      dataIndex: "role_id",
      key: "role_id",
    },
    {
      title: "Роль",
      dataIndex: "role_name",
      key: "role_name",
    },
    {
      title: "Действия",
      key: "action",
      render: (_: any, record: IRole) => (
        <Space size="middle">
          <Button type="dashed" onClick={() => onEdit(record.role_id as number)}>
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
          >
            Удалить
          </Button>
        </Space>
      ),
    },
  ];

  const dataSource = roleData?.map((role) => ({
    ...role,
    key: role.role_id, // Ensure each item has a unique key
  }));

  return <Table dataSource={dataSource} columns={columns} />;
};

export default RoleTable;
