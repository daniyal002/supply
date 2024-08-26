'use client';

import { IPost } from "@/interface/post";
import { Button, Space, Table } from "antd";
import { toast } from "sonner";
import { useDeletePostMutation } from "@/hook/postHook";

interface PostTableProps {
  postData: IPost[] | undefined;
  onEdit: (id: number) => void;
}

const PostTable: React.FC<PostTableProps> = ({ postData, onEdit }) => {
  const { mutate: deletePostMutation } = useDeletePostMutation();

  const columns = [
    {
      title: "ID",
      dataIndex: "post_id",
      key: "post_id",
    },
    {
      title: "Должность",
      dataIndex: "post_name",
      key: "post_name",
    },
    {
      title: "Действия",
      key: "action",
      render: (_: any, record: IPost) => (
        <Space size="middle">
          <Button type="dashed" onClick={() => onEdit(record.post_id as number)}>
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

  const dataSource = postData?.map((post) => ({
    ...post,
    key: post.post_id, // Ensure each item has a unique key
  }));

  return <Table dataSource={dataSource} columns={columns} />;
};

export default PostTable;
