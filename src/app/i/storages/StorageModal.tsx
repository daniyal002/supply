import { Modal } from "antd";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import style from "./StorageModal.module.scss";

import { IStorageCreateRequest, IStorageRequest } from "@/interface/storage";

import {
  useCreateStorageMutation,
  useStorageData,
  useUpdateStorageMutation,
} from "@/hook/storageHook";

interface Props {
  type: "Добавить" | "Изменить";
  storageId?: number;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

export default function StorageModal({
  type,
  storageId,
  isModalOpen,
  setIsModalOpen,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IStorageRequest>({ mode: "onChange" });

  const { storageData } = useStorageData();
  const { mutate: createStorage, error: createStorageError } =
    useCreateStorageMutation();
  const { mutate: updateStorage, error: updateStorageError } =
    useUpdateStorageMutation();

  const item = storageData?.find((s) => s.storage_id === storageId);

  const onSubmit: SubmitHandler<IStorageRequest> = (data) => {
    type === "Добавить"
      ? createStorage(data as IStorageCreateRequest)
      : updateStorage(data);

    reset();
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (storageId === undefined) {
      reset({
        storage_name: "",
        storage_1c_code: "",
        oms: false,
        note: "",
      });
    } else if (type === "Изменить") {
      reset({
        storage_id: item?.storage_id,
        storage_name: item?.storage_name,
        storage_1c_code: item?.storage_1c_code,
        oms: item?.oms,
        note: item?.note,
      });
    }
  }, [storageId, item, type, reset]);

  return (
    <Modal
      title={`${type} склад`}
      open={isModalOpen}
      onCancel={() => {
        setIsModalOpen(false);
        reset();
      }}
      footer={null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className={style.storageForm}>
        <div className={style.formItem}>
          <label className={style.formItemLabel}>Название склада</label>
          <input
            placeholder="Название склада"
            className={style.storageFormInput}
            {...register("storage_name", { required: {value:true, message:"Введите название склада"} })}
          />
          {errors.storage_name && (
            <p className={style.error}>{errors.storage_name.message}</p>
          )}
        </div>

        <div className={style.formItem}>
          <label className={style.formItemLabel}>1C код</label>
          <input
            className={style.storageFormInput}
            placeholder="1C код"
            {...register("storage_1c_code", { required: {value:true, message:"Введите 1С код"} })}
          />
          {errors.storage_1c_code && (
            <p className={style.error}>{errors.storage_1c_code.message}</p>
          )}
        </div>
        <div className={style.formItem}>
          <label className={style.formItemLabelOMS}>
            OMS
            <input
              className={style.storageFormChecbox}
              type="checkbox"
              {...register("oms")}
            />
          </label>
        </div>

        <div className={style.formItem}>
          <label className={style.formItemLabel}>Примечание</label>
          <input
            className={style.storageFormInput}
            placeholder="note"
            {...register("note")}
          />
        </div>

        <button type="submit" className={style.StorageBtn}>
          {type}
        </button>

        {createStorageError && (
          <p className={style.error}>{createStorageError?.message}</p>
        )}
        {updateStorageError && (
          <p className={style.error}>{updateStorageError?.message}</p>
        )}
      </form>
    </Modal>
  );
}
