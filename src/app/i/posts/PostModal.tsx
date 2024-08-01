import {
  useCreatePostMutation,
  usePostData,
  useUpdatePostMutation,
} from "@/hook/postHook";
import { IPost } from "@/interface/post";
import { Modal, Typography } from "antd";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import style from './PostModal.module.scss'

interface Props {
  type: "Добавить" | "Изменить";
  postId?: number;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

export default function PostModal({
  type,
  postId,
  isModalOpen,
  setIsModalOpen,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IPost>({ mode: "onChange" });
  const { postData } = usePostData();
  const { mutate: createPostMutation } = useCreatePostMutation();
  const { mutate: updatePostMutation } = useUpdatePostMutation();
  
  const onSubmit: SubmitHandler<IPost> = (data) => {
    type === "Добавить" ? createPostMutation(data) : updatePostMutation(data);
    reset();
    setIsModalOpen(false);
  };
  const itemPostData = postData?.find((post) => post.id === postId);

  useEffect(() => {
    if (postId === undefined) {
      reset({
        post_name: undefined,
      });
    } else if (type === "Изменить") {
      reset({
        id: itemPostData?.id,
        post_name: itemPostData?.post_name,
      });
    }
  }, [reset, type, postId,itemPostData]);

  return (
    <>
      <Modal
        title={`${type} должность`}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          reset();
        }}
        footer={(_) => <></>}
      >
        <form onSubmit={handleSubmit(onSubmit)} className={style.postForm}>
          <div className={style.formItem}>
          <label className={style.formItemLabel}>Название должности</label>
          <input
            type="text"
            placeholder="Должность"
            className={style.postName}
            {...register("post_name", {
              required: { message: "Введите должность", value: true },
            })}
          />
          </div>
          {errors && (<p className={style.error}>{errors.post_name?.message}</p>)}

          <button type="submit" className={style.postNameSubmit}>{type}</button>
        </form>
      </Modal>
    </>
  );
}
