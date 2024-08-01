'use client';

import { Button, Space, Table, TableColumnsType } from "antd";
import { toast } from "sonner";
import { IDepartment } from "@/interface/department";
import { IParlor } from "@/interface/parlor";
import { useDeleteParlorMutation } from "@/hook/parlorHook";

interface PostTableProps {
  parlorData: IParlor[] | undefined;
  onEdit: (id: number) => void;
}

const ParlorTable: React.FC<PostTableProps> = ({ parlorData, onEdit }) => {
  const { mutate: deleteParlorMutation } = useDeleteParlorMutation();

  const columns: TableColumnsType<IParlor> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a:any, b:any) => a.id - b.id,
    },
    
    {
      title: 'Кабинет',
      dataIndex: 'parlor_name',
      key: 'parlor_name',
      sorter: (a: any, b: any) => a.parlor_name.localeCompare(b.parlor_name, 'ru'),
    },
    {
      title: 'Подразделение',
      dataIndex: 'department',
      key: 'department',
      sorter: (a: any, b: any) => a.department.department_name.localeCompare(b.department.department_name, 'ru'),
      render: (department:IDepartment) => department?.department_name
    },
    {
      title: "Действия",
      key: "action",
      render: (_: any, record: IParlor) => (
        <Space size="middle">
          <Button type="dashed" onClick={() => onEdit(record.id as number)}>
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
                  onClick: () => deleteParlorMutation(record),
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

  const dataSource = parlorData?.map((parlor) => ({
    ...parlor,
    key: parlor.id, // Ensure each item has a unique key
  }));

  return <Table dataSource={dataSource} columns={columns} />;
};

export default ParlorTable;
