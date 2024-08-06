import React, { useEffect } from "react";
import style from "./HeaderOrder.module.scss";
import { Checkbox, Select } from "antd";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { IOrderItemFormValues, IOrderItemRequest } from "@/interface/orderItem";
import { useGetMe } from "@/hook/userHook";

interface Props {
  control: Control<IOrderItemFormValues>;
  register: UseFormRegister<IOrderItemFormValues>;
  getValues: UseFormGetValues<IOrderItemFormValues>;
  setValue: UseFormSetValue<IOrderItemFormValues>;
  watch: UseFormWatch<IOrderItemFormValues>;
  errors:FieldErrors<IOrderItemFormValues>
}

export default function HeaderOrder({
  control,
  register,
  getValues,
  setValue,
  watch,
  errors
}: Props) {
  const { GetMeData } = useGetMe();
  const employee_idWatch = watch("employee_id");
  
  useEffect(()=>{
    console.log(getValues("employee_id.value"))
  },[employee_idWatch])
  const employeeSet = new Set();
  const optionsEmployee =
    GetMeData?.employee?.parlor?.flatMap((parlor) =>
      parlor.employees
        .filter((employee) => {
          if (employeeSet.has(employee.id)) {
            return false;
          } else {
            employeeSet.add(employee.id);
            return true;
          }
        })
        .map((employee) => ({
          value: employee.id,
          label: employee.buyer_name,
        }))
    ) || [];

  const departmentSet = new Set();
  const optionsDepartment = GetMeData?.employee?.parlor
    ?.flatMap((parlor) =>
      parlor.employees.some(
        (employee) => employee.id === getValues("employee_id.value")
      )
        ? [parlor]
        : []
    )
    .filter((parlor) => {
      if (departmentSet.has(parlor.department?.id)) {
        return false;
      } else {
        departmentSet.add(parlor.department?.id);
        return true;
      }
    })
    .map((parlor) => ({
      value: parlor.department?.id,
      label: parlor.department?.department_name,
    }));
  return (
    <div className={style.headerOrder}>
      <div className={style.headerOrderSelect}>

      <div className={`${style.Checkbox}`}>
        <label className={style.formItemLabel}>ОМС</label>
        <Controller
          control={control}
          name="oms"
          render={({ field }) => <Checkbox {...field} />}
        />
      </div>
      <div className={style.formItem}>
        <label className={style.formItemLabel}>Выберите сотрудника</label>
        <Controller
          control={control}
          name="employee_id"
          rules={{
            required: { message: "Выберите сотрудника", value: true },
          }}
          render={({ field }) => (
            <Select
              {...field}
              options={optionsEmployee}
              onChange={(value, option) => {
                    // @ts-ignore: Unreachable code error
                setValue("employee_id.value", value);
                    // @ts-ignore: Unreachable code error
                field.onChange({ value: value, label: option.label });
              }}
              placeholder="Сотрудник"
            />
          )}
        />
      </div>
      {errors && <p className={style.error}>{errors.employee_id?.message}</p>}

      <div className={style.formItem}>
        <label className={style.formItemLabel}>Выберите подразделение</label>
        <Controller
          control={control}
          name="department_id"
          rules={{
            required: { message: "Выберите подразделение", value: true },
          }}
          render={({ field }) => (
            <Select
              {...field}
              options={optionsDepartment}
              onChange={(value, option) =>
                // @ts-ignore: Unreachable code error
                field.onChange({ value: value, label: option.label })
              }
              placeholder="Подразделение"
            />
          )}
        />
      </div>
      {errors && <p className={style.error}>{errors.department_id?.message}</p>}
      </div>
    <div className={style.headerOrderTextArea}>
      <div className={style.formItem}>
          <label className={style.formItemLabel}>Примечание</label>
          <textarea
            placeholder="Примечание"
            className={style.modalTextArea}
            {...register("note")}
          />
        </div>
        </div>
    </div>
  );
}
