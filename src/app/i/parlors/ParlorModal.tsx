import { Modal, Select } from "antd";
import React, { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import style from "./ParlorModal.module.scss";
import { useDepartmentData } from "@/hook/departmentHook";
import {
  useCreateParlorMutation,
  useParlorData,
  useUpdateParlorMutation,
} from "@/hook/parlorHook";
import { useFloorData } from "@/hook/floorHook";
import { IParlor, IParlorFormValues } from "@/interface/parlor";

interface Props {
  type: "Добавить" | "Изменить";
  parlorId?: number;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

export default function ParlorModal({
  type,
  parlorId,
  isModalOpen,
  setIsModalOpen,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<IParlorFormValues>({ mode: "onChange" });
  const { parlorData } = useParlorData();
  const { departmentData } = useDepartmentData();
  const { floorData } = useFloorData();

  const { mutate: createParlorMutation } = useCreateParlorMutation();
  const { mutate: updateParlorMutation } = useUpdateParlorMutation();

  const onSubmit: SubmitHandler<IParlorFormValues> = (data) => {
    const itemDepartmentData = departmentData?.find(
      (department) => department.department_id === data.department?.value
    );

    const itemFloorData = floorData?.find((floor) => floor.id === data.floor?.value);
    console.log("data",data);
    console.log("itemDepartmentData",itemDepartmentData);
    // console.log("itemFloorData",itemFloorData);
    const updateParlor: IParlor = {
      ...data,
      department: itemDepartmentData,
      floor: itemFloorData,
    };
    type === "Добавить"
      ? createParlorMutation(updateParlor)
      : updateParlorMutation(updateParlor);
    reset();
    setIsModalOpen(false);
  };

  const itemParlorData = parlorData?.find((parlor) => parlor.id === parlorId);

  useEffect(() => {
    console.log(itemParlorData);
    if (parlorId === undefined) {
      reset({
        parlor_name: undefined,
        department: undefined,
        floor: undefined,
      });
    } else if (type === "Изменить" && itemParlorData) {
      reset({
        id: itemParlorData?.id,
        parlor_name: itemParlorData.parlor_name,
        department: {
          value: itemParlorData?.department?.department_id,
          label: itemParlorData?.department?.department_name,
        },
        floor: {
          value: itemParlorData?.floor?.id,
          label: itemParlorData?.floor?.floor_name,
        },
      });
    }
  }, [reset, type, parlorId, itemParlorData]);

  const optionsDepartment = departmentData?.map((department) => ({
    value: department.department_id as number,
    label: department.department_name as string,
  }));

  const optionsFloor = floorData?.map((floor) => ({
    value: floor.id as number,
    label: floor.floor_name as string,
  }));

  return (
    <Modal
      title={`${type} кабинет`}
      open={isModalOpen}
      onCancel={() => {
        setIsModalOpen(false);
        reset();
      }}
      footer={null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className={style.parlorForm}>
        <div className={style.formItem}>
          <label className={style.formItemLabel}>Название/Номер кабинета</label>
          <input
            type="text"
            placeholder="Кабинет"
            className={style.parlorName}
            {...register("parlor_name", {
              required: { message: "Введите кабинет", value: true },
            })}
          />
        </div>

        {errors && <p className={style.error}>{errors.parlor_name?.message}</p>}

        <div className={style.formItem}>
          <label className={style.formItemLabel}>Выберите подразделение</label>
          <Controller
            control={control}
            name="department"
            rules={{
              required: { message: "Выберите подразделение", value: true },
            }}
            render={({ field }) => (
              <Select
                {...field}
                options={optionsDepartment}
                // @ts-ignore: Unreachable code error
                onChange={(value, option) => field.onChange({value:value,label:option.label})}
                placeholder="Подразделение"
              />
            )}
          />
        </div>

        {errors && <p className={style.error}>{errors.department?.message}</p>}

        <div className={style.formItem}>
          <label className={style.formItemLabel}>Выберите этаж</label>
          <Controller
            control={control}
            name="floor"
            rules={{
              required: { message: "Выберите этаж", value: true },
            }}
            render={({ field }) => (
              <Select
                {...field}
                options={optionsFloor}
                // @ts-ignore: Unreachable code error
                onChange={(value, option) => field.onChange({value:value,label:option.label})}
                placeholder="Этаж"
              />
            )}
          />
        </div>

        {errors && <p className={style.error}>{errors.floor?.message}</p>}

        <button type="submit" className={style.parlorNameSubmit}>
          {type}
        </button>
      </form>
    </Modal>
  );
}
