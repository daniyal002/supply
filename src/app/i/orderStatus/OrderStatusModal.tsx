import { ColorPicker, Modal } from "antd";
import React, { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import style from "./OrderStatusModal.module.scss";
import { IOrderStatus } from "@/interface/orderStatus";
import {
  useCreateOrderStatusMutation,
  useGetOrderStatus,
  useUpdateOrderStatusMutation,
} from "@/hook/orderStatusHook";

interface Props {
  type: "Добавить" | "Изменить";
  OrderStatusId?: number;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

export default function OrderStatusModal({
  type,
  OrderStatusId,
  isModalOpen,
  setIsModalOpen,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<IOrderStatus>({ mode: "onChange" });
  const { orderStatusData } = useGetOrderStatus();
  const { mutate: createOrderStatusMutation } = useCreateOrderStatusMutation();
  const { mutate: updateOrderStatusMutation } = useUpdateOrderStatusMutation();

  const onSubmit: SubmitHandler<IOrderStatus> = (data) => {
    type === "Добавить"
      ? createOrderStatusMutation(data)
      : updateOrderStatusMutation(data);
    reset();
    setIsModalOpen(false);
  };
  const itemOrderStatus = orderStatusData?.find(
    (status) => status.status_id === OrderStatusId
  );

  useEffect(() => {
    if (OrderStatusId === undefined) {
      reset({
        status_name: undefined,
        status_color: undefined,
        note: undefined,
      });
    } else if (type === "Изменить") {
      reset({
        status_id: itemOrderStatus?.status_id,
        status_name: itemOrderStatus?.status_name,
        status_color: itemOrderStatus?.status_color,
        note: itemOrderStatus?.note,
      });
    }
  }, [reset, type, OrderStatusId, itemOrderStatus]);

  return (
    <>
      <Modal
        title={`${type} Статус`}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          reset();
        }}
        footer={(_) => <></>}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={style.orderStatusForm}
        >
          <div className={style.formItem}>
            <label className={style.formItemLabel}>Название статуса</label>
            <input
              type="text"
              placeholder="Статус"
              className={style.orderStatusName}
              {...register("status_name", {
                required: { message: "Введите название статуса", value: true },
              })}
            />
          </div>
          {errors && (
            <p className={style.error}>{errors.status_name?.message}</p>
          )}

          <div className={style.formItem}>
            <label className={style.formItemLabel}>Выберите Цвет</label>
            <Controller
              control={control}
              name="status_color"
              rules={{
                required: { message: "Выберите цвет", value: true },
              }}
              render={({ field }) => (
                <ColorPicker
                  {...field}
                  onChange={(color, hex) => {
                    field.onChange(hex); // Отправляем только HEX-строку в форму
                  }}
                  format="hex"
                />
              )}
            />
          </div>
          {errors && (
            <p className={style.error}>{errors.status_color?.message}</p>
          )}

          <div className={style.formItem}>
            <label className={style.formItemLabel}>Примечание</label>
            <input
              type="text"
              placeholder="Примечание"
              className={style.orderStatusNote}
              {...register("note", {
                required: { message: "Введите должность", value: true },
              })}
            />
          </div>
          {errors && <p className={style.error}>{errors.note?.message}</p>}

          <button type="submit" className={style.orderStatusSubmit}>
            {type}
          </button>
        </form>
      </Modal>
    </>
  );
}
