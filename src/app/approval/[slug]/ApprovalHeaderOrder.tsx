import React, { useEffect, useState } from "react";
import style from "./ApprovalHeaderOrder.module.scss";
import { Checkbox, Input, Select, Switch } from "antd";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { EnumOrderTypes, IOrderItemFormValues } from "@/interface/orderItem";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db/db";
import { useProductData } from "@/hook/productHook";
import { optionsOrderTypes, optionsStorage } from "@/helper/options";

interface Props {
  control: Control<IOrderItemFormValues>;
  register: UseFormRegister<IOrderItemFormValues>;
  getValues: UseFormGetValues<IOrderItemFormValues>;
  setValue: UseFormSetValue<IOrderItemFormValues>;
  watch: UseFormWatch<IOrderItemFormValues>;
  errors: FieldErrors<IOrderItemFormValues>;
}

export default function ApprovalHeaderOrder({
  control,
  register,
  getValues,
  setValue,
  watch,
  errors,
}: Props) {
  const { TextArea } = Input;

  const GetMeData = useLiveQuery(() => db.getMe.toCollection().first(), []);
  const { productData } = useProductData();
  const [productSelect, setProductSelect] = useState<boolean>(false);

  const employee_idWatch = watch("employee_id");
  const isProductInTable = watch("order_products");

  useEffect(() => {
    if (isProductInTable && isProductInTable.length > 0) {
      setProductSelect(true);
    } else {
      setProductSelect(false);
    }
  }, [isProductInTable]);

  const optionsProductGroup = Array.from(
    new Set(
      productData?.map((product) => ({
        value: product.product_group.product_group_id,
        label: product.product_group.product_group_name,
      }))
    )
  );

  const employeeSet = new Set();
  const optionsEmployee =
    GetMeData?.employee?.parlors?.flatMap((parlor) =>
      parlor.employees
        .filter((employee) => {
          if (employeeSet.has(employee.buyer_id)) {
            return false;
          } else {
            employeeSet.add(employee.buyer_id);
            return true;
          }
        })
        .map((employee) => ({
          value: employee.buyer_id,
          label: employee.buyer_name,
        }))
    ) || [];

  const departmentSet = new Set();
  const optionsDepartment = GetMeData?.employee?.parlors
    ?.flatMap((parlor) =>
      parlor.employees.some(
        (employee) => employee.buyer_id === getValues("employee_id.value")
      )
        ? [parlor]
        : []
    )
    .filter((parlor) => {
      if (departmentSet.has(parlor.department?.department_id)) {
        return false;
      } else {
        departmentSet.add(parlor.department?.department_id);
        return true;
      }
    })
    .map((parlor) => ({
      value: parlor.department?.department_id,
      label: parlor.department?.department_name,
    }));


  return (
    <div className={style.headerOrder}>
      <div className={style.headerOrderSelect}>
      <div className={style.CheckboxStorage}>
        <div className={style.formItem}>
          <label className={style.formItemLabel}>Тип</label>
          <Controller
            control={control}
            name="order_type"
            rules={{
              required: { message: "Выберите тип", value: true },
            }}
            render={({ field }) => (
              <Select
                {...field}
                disabled
                options={optionsOrderTypes}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                onChange={(value, option) => {
                  // @ts-ignore: Unreachable code error
                  field.onChange({ value: value, label: option.label });
                }}
                placeholder="Тип"
                className={style.formItemSelect}
              />
            )}
          />
          {errors && (
            <p className={style.error}>{errors.order_type?.message}</p>
          )}
        </div>

        <div className={style.formItem}>
          <label className={style.formItemLabel}>Место хранения</label>
          <Controller
            control={control}
            name="storage_id"
            rules={{
              required: { message: "Выберите место хранения", value: true },
            }}
            render={({ field }) => (
              <Select
                {...field}
                disabled
                options={optionsStorage(GetMeData?.employee?.storages || [])}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                onChange={(value, option) => {
                  // @ts-ignore: Unreachable code error
                  setValue("storage_id.value", value);
                  // @ts-ignore: Unreachable code error
                  field.onChange({ value: value, label: option.label });
                  GetMeData?.employee?.storages?.find(
                    (storage) =>
                      storage.storage_id === getValues("storage_id.value")
                  )?.oms
                    ? setValue("oms", true)
                    : setValue("oms", false);
                }}
                placeholder="Склад"
                className={style.formItemSelect}
              />
            )}
          />
           <div className={`${style.Checkbox}`}>
            <Controller
              control={control}
              name="oms"
              render={({ field }) => (
                <Switch
                  {...field}
                  disabled
                  checked={field.value}
                  checkedChildren={"ОМС"}
                  unCheckedChildren={"ПУ"}
                  title={field.value ? "ОМС" : "ПУ"}
                />
              )}
            />
          </div>
        </div>
        </div>
        <div className={style.EmployeeDepartmentCategory}>
        <div className={style.formItem}>
          <label className={style.formItemLabel}>Сотрудник</label>
          {/* <label className={style.formItemLabel}>Выберите сотрудника</label> */}
          <Controller
            control={control}
            name="employee_id"
            rules={{
              required: { message: "Выберите сотрудника", value: true },
            }}
            render={({ field }) => (
              <Select
                {...field}
                disabled
                options={optionsEmployee}
                onChange={(value, option) => {
                  // @ts-ignore: Unreachable code error
                  setValue("employee_id.value", value);
                  // @ts-ignore: Unreachable code error
                  field.onChange({ value: value, label: option.label });
                }}
                placeholder="Сотрудник"
                className={style.formItemSelect}
              />
            )}
          />
          {errors && (
            <p className={style.error}>{errors.employee_id?.message}</p>
          )}
        </div>

        <div className={style.formItem}>
          <label className={style.formItemLabel}>Подразделение</label>
          {/* <label className={style.formItemLabel}>Выберите подразделение</label> */}
          <Controller
            control={control}
            name="department_id"
            rules={{
              required: { message: "Выберите подразделение", value: true },
            }}
            render={({ field }) => (
              <Select
                {...field}
                disabled
                options={optionsDepartment}
                onChange={(value, option) =>
                  // @ts-ignore: Unreachable code error
                  field.onChange({ value: value, label: option.label })
                }
                placeholder="Подразделение"
                className={style.formItemSelect}
              />
            )}
          />
          {errors && (
            <p className={style.error}>{errors.department_id?.message}</p>
          )}
        </div>

        <div className={style.formItem}>
          <label className={style.formItemLabel}>Категория товара</label>
          {/* <label className={style.formItemLabel}>Выберите группу товара</label> */}
          <Controller
            control={control}
            name="product_group"
            rules={{
              required: { message: "Выберите категорию товара", value: true },
            }}
            render={({ field }) => (
              <Select
                {...field}
                options={optionsProductGroup}
                disabled
                onChange={(value, option) =>
                  // @ts-ignore: Unreachable code error
                  field.onChange({ value: value, label: option.label })
                }
                placeholder="Категория товара"
                className={style.formItemSelect}
              />
            )}
          />
          {errors && (
            <p className={style.error}>{errors.department_id?.message}</p>
          )}
        </div>

        <div className={style.formItem}>
          <label className={style.formItemLabel}>Автор</label>
          <Controller
            control={control}
            name="order_author_name"
            render={({ field }) => (
              <Select
                {...field}
                disabled
                options={[
                  {
                    value: getValues("order_author_name"),
                    title: getValues("order_author_name"),
                  },
                ]}
                onChange={(value, option) =>
                  // @ts-ignore: Unreachable code error
                  field.onChange({ value: value, label: option.label })
                }
                placeholder="Автор"
                className={style.formItemSelect}
              />
            )}
          />
        </div>
        </div>
      </div>
      <div className={style.headerOrderTextArea}>
        <div className={style.formItem}>
          <label className={style.formItemLabel}>Примечание</label>
          <Controller
            control={control}
            name="note"
            render={({ field }) => (
              <TextArea
                placeholder="Примечание"
                className={style.modalTextArea}
                disabled
                {...field}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}
