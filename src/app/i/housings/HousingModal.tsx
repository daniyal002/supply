
import { Modal, Select, Typography } from "antd";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import style from './HousingModal.module.scss'
import { IHousing } from "@/interface/housing";
import { useCreateHousingMutation, useHousingData, useUpdateHousingMutation } from "@/hook/housingHook";

interface Props {
  type: "Добавить" | "Изменить";
  housingId?: number;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

export default function HousingModal({
  type,
  housingId,
  isModalOpen,
  setIsModalOpen,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IHousing>({ mode: "onChange" });
  const { housingsData } = useHousingData();
  const { mutate: createHousingMutation } = useCreateHousingMutation();
  const { mutate: updateHousingMutation } = useUpdateHousingMutation();
  const onSubmit: SubmitHandler<IHousing> = (data) => {
    type === "Добавить" ? createHousingMutation(data) : updateHousingMutation(data);
    reset();
    setIsModalOpen(false);
  };
  const itemHousingsData = housingsData?.find((housing) => housing.id === housingId);

  useEffect(() => {
    if (housingId === undefined) {
      reset({
        housing_name: undefined,
      });
    } else if (type === "Изменить") {
      reset({
        id: itemHousingsData?.id,
        housing_name: itemHousingsData?.housing_name,
      });
    }
  }, [reset, type, housingId,itemHousingsData]);

  return (
    <>
      <Modal
        title={`${type} корпус`}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          reset();
        }}
        footer={(_) => <></>}
      >
        <form onSubmit={handleSubmit(onSubmit)} className={style.housingForm}>
          <div className={style.formItem}>
          <label className={style.formItemLabel}>Название корпуса</label>
          <input
            type="text"
            placeholder="Должность"
            className={style.housingName}
            {...register("housing_name", {
              required: { message: "Введите корпус", value: true },
            })}
          />
          </div>
          
          {errors && (<p className={style.error}>{errors.housing_name?.message}</p>)}

          <button type="submit" className={style.housingNameSubmit}>{type}</button>
        </form>
      </Modal>
    </>
  );
}
