import React, { useEffect, useState } from "react";
import style from "./HeaderOrder.module.scss";
import { Checkbox, Select, Input } from "antd";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  useWatch,
} from "react-hook-form";
import { EnumOrderTypes, IOrderItemFormValues } from "@/interface/orderItem";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db/db";
import { useProductData } from "@/hook/productHook";

interface Props {
  control: Control<IOrderItemFormValues>;
  register: UseFormRegister<IOrderItemFormValues>;
  getValues: UseFormGetValues<IOrderItemFormValues>;
  setValue: UseFormSetValue<IOrderItemFormValues>;
  watch: UseFormWatch<IOrderItemFormValues>;
  errors: FieldErrors<IOrderItemFormValues>;
  disabledOrder: boolean;
}

export default function HeaderOrder({
  control,
  register,
  getValues,
  setValue,
  watch,
  errors,
  disabledOrder,
}: Props) {
  const { TextArea } = Input;
  const GetMeData = useLiveQuery(() => db.getMe.toCollection().first(), []);
  const { productData } = useProductData();
  const [productSelect, setProductSelect] = useState<boolean>(false);

  const employee_idWatch = watch("employee_id");
  const isProductInTable = watch("order_products");

  const storageId = useWatch({ control, name: "storage_id" });
  const employeeId = useWatch({ control, name: "employee_id" });
  const departmentId = useWatch({ control, name: "department_id" });

  useEffect(() => {
    if (isProductInTable && isProductInTable.length > 0) {
      setProductSelect(true);
    } else {
      setProductSelect(false);
    }
  }, [isProductInTable]);

  const optionsProductGroupSet = new Set();
  const optionsProductGroup1 = productData
    ?.map((product) => product.product_group)
    .filter((productGroup) => {
      if (optionsProductGroupSet.has(productGroup.product_group_id)) {
        return false;
      } else {
        optionsProductGroupSet.add(productGroup.product_group_id);
        return true;
      }
    })
    .map((productGroup) => ({
      value: productGroup.product_group_id,
      label: productGroup.product_group_name,
    }))
    .sort((a, b) => a.label.localeCompare(b.label, "ru"));

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

  const optionsStorage = GetMeData?.employee?.storages?.map((storage) => ({
    value: storage.storage_id,
    label: storage.storage_name,
  }));

  const optionsOrderTypes: { value: string; label: string }[] = [
    { value: EnumOrderTypes.WAREHOUSE, label: "Заявка на склад" },
    { value: EnumOrderTypes.PURCHASE, label: "Заявка на закуп" },
  ];

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
      // label: `${parlor.department?.department_name}-${parlor.department?.housing?.housing_name}`,
      label: parlor.department?.department_name,
    }));
  return (
    <div className={style.headerOrder}>
      <div className={style.headerOrderSelect}>
        <div className={style.CheckboxStorage}>
          {/* <div className={style.formItem}>
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
                  disabled={disabledOrder}
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
          </div> */}

          <div className={`${style.Checkbox}`}>
            <label className={style.formItemLabel}>ОМС</label>
            <Controller
              control={control}
              name="oms"
              render={({ field }) => (
                <Checkbox {...field} checked={field.value} disabled={true} />
              )}
            />
          </div>

          <div className={style.formItem}>
            <label className={style.formItemLabel}>Склад</label>
            <Controller
              control={control}
              name="storage_id"
              rules={{
                required: { message: "Выберите склад", value: true },
              }}
              render={({ field }) => (
                <Select
                  {...field}
                  disabled={disabledOrder}
                  options={optionsStorage}
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
            {errors.storage_id && (
              <p className={style.error}>{errors.storage_id?.message}</p>
            )}
          </div>
        </div>

        <div className={style.EmployeeDepartmentCategory}>
          <div className={style.formItem}>
            <label className={style.formItemLabel}>Cотрудник/Кабинет</label>
            <Controller
              control={control}
              name="employee_id"
              rules={{
                required: { message: "Выберите сотрудника", value: true },
              }}
              render={({ field }) => (
                <Select
                  {...field}
                  disabled={disabledOrder || !storageId}
                  options={optionsEmployee}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  onChange={(value, option) => {
                    // @ts-ignore: Unreachable code error
                    setValue("employee_id.value", value);
                    // @ts-ignore: Unreachable code error
                    field.onChange({ value: value, label: option.label });
                  }}
                  placeholder="Сотрудник/Кабинет"
                  className={style.formItemSelect}
                />
              )}
            />
            {errors.employee_id && (
              <p className={style.error}>{errors.employee_id?.message}</p>
            )}
          </div>

          <div className={style.formItem}>
            <label className={style.formItemLabel}>Подразделение</label>
            <Controller
              control={control}
              name="department_id"
              rules={{
                required: { message: "Выберите подразделение", value: true },
              }}
              render={({ field }) => (
                <Select
                  {...field}
                  disabled={disabledOrder || !employeeId}
                  options={optionsDepartment}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  onChange={(value, option) =>
                    // @ts-ignore: Unreachable code error
                    field.onChange({ value: value, label: option.label })
                  }
                  placeholder="Подразделение"
                  className={style.formItemSelect}
                />
              )}
            />
            {errors.department_id && (
              <p className={style.error}>{errors.department_id?.message}</p>
            )}
          </div>

          <div className={style.formItem}>
            <label className={style.formItemLabel}>Категория товара</label>
            <Controller
              control={control}
              name="product_group"
              rules={{
                required: { message: "Выберите категорию товара", value: true },
              }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={optionsProductGroup1}
                  // disabled={disabledOrder ? true : productSelect ? true : false}
                  disabled={
                    disabledOrder || productSelect || !departmentId?.value
                  }
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  onChange={(value, option) =>
                    // @ts-ignore: Unreachable code error
                    field.onChange({ value: value, label: option.label })
                  }
                  placeholder="Категория товара"
                  className={style.formItemSelect}
                />
              )}
            />
            {errors.product_group && (
              <p className={style.error}>{errors.product_group?.message}</p>
            )}
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
                disabled={disabledOrder}
                {...field}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}
