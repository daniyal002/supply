'use client';

import { Button, Space, Table, TableColumnsType } from "antd";
import { toast } from "sonner";
import { IParlor } from "@/interface/parlor";
import { IEmployee } from "@/interface/employee";
import { IPost } from "@/interface/post";
import { useDeleteEmployeeMutation } from "@/hook/employeeHook";

interface EmployeeTableProps {
  employeeData: IEmployee[] | undefined;
  onEdit: (id: number) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ employeeData, onEdit }) => {
  const { mutate: deleteEmployeeMutation } = useDeleteEmployeeMutation();

  const columns: TableColumnsType<IEmployee> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a:any, b:any) => a.id - b.id,
    },
    
    {
      title: 'Наименование',
      dataIndex: 'buyer_name',
      key: 'buyer_name',
      sorter: (a: any, b: any) => a.buyer_name.localeCompare(b.buyer_name, 'ru'),
    },
    {
      title: 'Вид',
      dataIndex: 'buyer_type',
      key: 'buyer_type',
      sorter: (a: any, b: any) => a.buyer_type.localeCompare(b.buyer_type, 'ru'),
      render:(buyerType) => buyerType === "employee" ? "Сотрудник" : "Кабинет" 
    },
    {
      title: 'Кабинет',
      dataIndex: 'parlor',
      key: 'parlor',
      sorter: (a: any, b: any) => a.parlor.parlor_name.localeCompare(b.parlor.parlor_name, 'ru'),
      render: (parlor: IParlor[]) => parlor?.map((parlor, index) => (
        <div key={index}>{parlor?.parlor_name}</div> 
      ))
    },
    {
      title: 'Должность',
      dataIndex: 'post',
      key: 'post',
      sorter: (a: any, b: any) => a?.post?.post_name?.localeCompare(b?.post?.post_name, 'ru'),
      render: (post: IPost) => post?.post_name // Or any other suitable React element 
    },
    {
      title: "Действия",
      key: "action",
      render: (_: any, record: IEmployee) => (
        <Space size="middle">
          <Button type="dashed" onClick={() => onEdit(record.buyer_id as number)}>
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
                  onClick: () => deleteEmployeeMutation(record),
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

  const dataSource = employeeData?.map((employee) => ({
    ...employee,
    key: employee.buyer_id, // Ensure each item has a unique key
  }));

  return <Table dataSource={dataSource} columns={columns} />;
};

export default EmployeeTable;
