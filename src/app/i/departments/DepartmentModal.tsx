import { Modal, Select } from "antd";
import React, { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import style from "./DepartmentModal.module.scss";
import { IDepartmentFormValues, IDepartment } from "@/interface/department";
import {
  useCreateDepartmentMutation,
  useDepartmentData,
  useUpdateDepartmentMutation,
} from "@/hook/departmentHook";
import { useHousingData } from "@/hook/housingHook";

interface Props {
  type: "Добавить" | "Изменить";
  departmentId?: number;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

export default function DepartmentModal({
  type,
  departmentId,
  isModalOpen,
  setIsModalOpen,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<IDepartmentFormValues>({ mode: "onChange" });
  const { departmentData } = useDepartmentData();
  const { housingsData } = useHousingData();
  const { mutate: createDepartmentMutation } = useCreateDepartmentMutation();
  const { mutate: updateDepartmentMutation } = useUpdateDepartmentMutation();

  const onSubmit: SubmitHandler<IDepartmentFormValues> = (data) => {
    const itemHousingData = housingsData?.find(
      (housing) => housing.id === data.housing?.value
    );

    const updateDepartment: IDepartment = { ...data, housing: itemHousingData };
    type === "Добавить"
      ? createDepartmentMutation(updateDepartment)
      : updateDepartmentMutation(updateDepartment);
    reset();
    setIsModalOpen(false);
  };

  const itemDepartmentData = departmentData?.find(
    (department) => department.id === departmentId
  );

  useEffect(() => {
    if (departmentId === undefined) {
      reset({
        department_name: undefined,
        housing: undefined,
      });
    } else if (type === "Изменить" && itemDepartmentData) {
      reset({
        id: itemDepartmentData?.id,
        department_name: itemDepartmentData?.department_name,
        housing: {
          value: itemDepartmentData?.housing?.id,
          label: itemDepartmentData?.housing?.housing_name,
        },
      });
    }
  }, [reset, type, departmentId, itemDepartmentData]);

  const options = housingsData?.map((housing) => ({
    value: housing.id as number,
    label: housing.housing_name as string,
  }));

  return (
    <Modal
      title={`${type} подразделение`}
      open={isModalOpen}
      onCancel={() => {
        setIsModalOpen(false);
        reset();
      }}
      footer={null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className={style.departmentForm}>
        <div className={style.formItem}>
          <label className={style.formItemLabel}>Название подразделения</label>
          <input
            type="text"
            placeholder="Подразделение"
            className={style.departmentName}
            {...register("department_name", {
              required: { message: "Введите подразделение", value: true },
            })}
          />
        </div>

        <div className={style.formItem}>
          <label className={style.formItemLabel}>Выберите корпус</label>
          <Controller
            control={control}
            name="housing"
            render={({ field }) => (
              <Select
                {...field}
                options={options}
                // @ts-ignore: Unreachable code error
                onChange={(value, option) => field.onChange({value:value,label:option.label})} 
              />
            )}
          />
        </div>

        {errors && (
          <p className={style.error}>{errors.department_name?.message}</p>
        )}

        <button type="submit" className={style.departmentNameSubmit}>
          {type}
        </button>
      </form>
    </Modal>
  );
}
