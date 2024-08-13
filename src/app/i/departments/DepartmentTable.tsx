'use client';

import { Button, Space, Table } from "antd";
import { toast } from "sonner";
import { IDepartment } from "@/interface/department";
import { useDeleteDepartmentMutation } from "@/hook/departmentHook";
import { IHousing } from "@/interface/housing";

interface PostTableProps {
  departmentData: IDepartment[] | undefined;
  onEdit: (id: number) => void;
}

const DepartmentTable: React.FC<PostTableProps> = ({ departmentData, onEdit }) => {
  const { mutate: deleteDepartmentMutation } = useDeleteDepartmentMutation();

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Подразделение",
      dataIndex: "department_name",
      key: "department_name",
    },
    {
      title: 'Корпус',
      dataIndex: 'housing',
      key: 'housing',
      sorter: (a: any, b: any) => a.housing?.housing_name.localeCompare(b.housing?.housing_name, 'ru'),
      render: (housing:IHousing) => housing?.housing_name
    },
    {
      title: "Действия",
      key: "action",
      render: (_: any, record: IDepartment) => (
        <Space size="middle">
          <Button type="dashed" onClick={() => onEdit(record.department_id as number)}>
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
                  onClick: () => deleteDepartmentMutation(record),
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

  const dataSource = departmentData?.map((department) => ({
    ...department,
    key: department.department_id, // Ensure each item has a unique key
  }));

  return <Table dataSource={dataSource} columns={columns} />;
};

export default DepartmentTable;
