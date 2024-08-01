'use client';

import { IPost } from "@/interface/post";
import { Button, Space, Table } from "antd";
import { toast } from "sonner";
import { IHousing } from "@/interface/housing";
import { useDeleteHousingMutation } from "@/hook/housingHook";

interface PostTableProps {
  housingsData: IHousing[] | undefined;
  onEdit: (id: number) => void;
}

const HousingTable: React.FC<PostTableProps> = ({ housingsData, onEdit }) => {
  const { mutate: deletePostMutation } = useDeleteHousingMutation();

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Должность",
      dataIndex: "housing_name",
      key: "housing_name",
    },
    {
      title: "Действия",
      key: "action",
      render: (_: any, record: IHousing) => (
        <Space size="middle">
          <Button type="dashed" onClick={() => onEdit(record.id as number)}>
            Изменить
          </Button>
          <Button
            type="primary"
            danger
            onClick={() =>
              toast.error("Вы точно хотите удалить корпус ?", {
                style: {
                  color: "red",
                },
                action: {
                  label: "Удалить",
                  onClick: () => deletePostMutation(record),
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

  const dataSource = housingsData?.map((housing) => ({
    ...housing,
    key: housing.id, // Ensure each item has a unique key
  }));

  return <Table dataSource={dataSource} columns={columns} />;
};

export default HousingTable;
