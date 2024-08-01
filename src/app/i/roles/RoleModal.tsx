
import { Modal } from "antd";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import style from "./RoleModal.module.scss";
import {
  useCreateRoleMutation,
  useRoleData,
  useUpdateRoleMutation,
} from "@/hook/roleHook";
import { IRole } from "@/interface/role";

interface Props {
  type: "Добавить" | "Изменить";
  roleId?: number;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

export default function RoleModal({
  type,
  roleId,
  isModalOpen,
  setIsModalOpen,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IRole>({ mode: "onChange" });
  const { roleData } = useRoleData();
  const { mutate: createPostMutation } = useCreateRoleMutation();
  const { mutate: updatePostMutation } = useUpdateRoleMutation();
  const onSubmit: SubmitHandler<IRole> = (data) => {
    type === "Добавить" ? createPostMutation(data) : updatePostMutation(data);
    reset();
    setIsModalOpen(false);
  };
  const itemRoleData = roleData?.find((role) => role.id === roleId);

  useEffect(() => {
    if (roleId === undefined) {
      reset({
        role_name: undefined,
      });
    } else if (type === "Изменить") {
      reset({
        id: itemRoleData?.id,
        role_name: itemRoleData?.role_name,
      });
    }
  }, [reset, type, roleId, itemRoleData]);

  return (
    <>
      <Modal
        title={`${type} роли`}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          reset();
        }}
        footer={null}
      >
        <form onSubmit={handleSubmit(onSubmit)} className={style.roleForm}>
          <div className={style.formItem}>
            <label className={style.formItemLabel}>Название роли</label>
            <input
              type="text"
              placeholder="Роль"
              className={style.roleName}
              {...register("role_name", {
                required: { message: "Введите роль", value: true },
              })}
            />
          </div>
          {errors && <p className={style.error}>{errors.role_name?.message}</p>}

          <button type="submit" className={style.roleNameSubmit}>
            {type}
          </button>
        </form>
      </Modal>
    </>
  );
}
