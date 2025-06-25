'use client';

import { usePostData } from "@/hook/postHook";
import { Button } from "antd";
import { Toaster } from "sonner";
import PostTable from "./PostTable";
import PostModal from "./PostModal";
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";

export default function AdminPost() {
  const { postData } = usePostData();
  const [type, setType] = useState<"Добавить" | "Изменить">("Добавить");
  const [postId, setPostId] = useState<number>();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const onAdd = () => {
    setPostId(undefined);
    setType("Добавить");
    setIsModalOpen(true);
  };

  const onEdit = (id: number) => {
    setPostId(id);
    setType("Изменить");
    setIsModalOpen(true);
  };

  return (
    <div>
      <Toaster />
      <PostModal
        type={type}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        postId={postId}
      />
      <Button
        type="primary"
        shape="circle"
        icon={<PlusOutlined />}
        onClick={onAdd}
        style={{ marginBottom: "10px" }}
      />
      <PostTable postData={postData} onEdit={onEdit} />
    </div>
  );
}
