import React, { useEffect, useMemo, useState } from "react";
import style from "./HeaderOrder.module.scss";
import { Select, Input, Switch } from "antd";
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
import { useEmployeeData } from "@/hook/employeeHook";
import { optionsOrderTypes, optionsStorage } from "@/helper/options";

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
  const { employeeData } = useEmployeeData();

  const orderType = watch("order_type");
  const isGeneric = watch("is_generic") ? watch("is_generic") : false;
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

  useEffect(() => {
    if (orderType?.value === EnumOrderTypes.WAREHOUSE){
      setValue('is_generic', false)
    }
  }, [orderType])

  // Мемоизация опций для product_group
  const optionsProductGroup = useMemo(() => {
    if (!productData || !Array.isArray(productData)) return [];

    const seen = new Set();
    return productData
      .map((product) => product.product_group)
      .filter((productGroup) => {
        if (!productGroup?.product_group_id) return false;
        if (seen.has(productGroup.product_group_id)) return false;
        seen.add(productGroup.product_group_id);
        return true;
      })
      .map((productGroup) => ({
        value: productGroup.product_group_id,
        label: productGroup.product_group_name,
      }))
      .sort((a, b) => a.label.localeCompare(b.label, "ru"));
  }, [productData]);

  // Мемоизация опций для сотрудников (employee)
  const optionsEmployee = useMemo(() => {
    if (isGeneric) {
      return (
        employeeData?.map((employee) => ({
          value: employee.buyer_id,
          label: employee.buyer_name,
        })) || []
      );
    }

    if (!GetMeData?.employee?.parlors) return [];

    const seen = new Set();
    return GetMeData.employee.parlors.flatMap((parlor) =>
      parlor.employees
        .filter((employee) => {
          if (!employee?.buyer_id) return false;
          if (seen.has(employee.buyer_id)) return false;
          seen.add(employee.buyer_id);
          return true;
        })
        .map((employee) => ({
          value: employee.buyer_id,
          label: employee.buyer_name,
        }))
    );
  }, [isGeneric, employeeData, GetMeData?.employee?.parlors]);

  // Мемоизация опций для департаментов (department)
  const optionsDepartment = useMemo(() => {
    if (!GetMeData?.employee?.parlors || !getValues) return [];

    const employeeId = getValues("employee_id.value");
    if (!employeeId) return [];

    const seen = new Set();
    return isGeneric
      ? GetMeData?.employee?.parlors
          ?.filter((parlor) => parlor.department?.is_generic === true)
          .map((parlor) => ({
            value: parlor.department?.department_id,
            label: parlor.department?.department_name,
          }))
      : GetMeData?.employee?.parlors
          ?.flatMap((parlor) =>
            parlor.employees.some(
              (employee) => employee.buyer_id === employeeId
            )
              ? [parlor]
              : []
          )
          .filter((parlor) => {
            if (seen.has(parlor.department?.department_id)) {
              return false;
            } else {
              seen.add(parlor.department?.department_id);
              return true;
            }
          })
          .filter((parlor) => parlor.department?.is_generic === false)
          .map((parlor) => ({
            value: parlor.department?.department_id,
            // label: `${parlor.department?.department_name}-${parlor.department?.housing?.housing_name}`,
            label: parlor.department?.department_name,
          }));
  }, [GetMeData?.employee?.parlors, getValues()]);



  return (
    <div className={style.headerOrder}>
      <div className={style.headerOrderSelect}>
        <div className={style.CheckboxStorage}>
          {(GetMeData?.role?.role_name === "user_purchase" ||
            GetMeData?.role?.role_name === "admin") && (
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
              {orderType?.value === EnumOrderTypes.PURCHASE && (
                <div className={`${style.Checkbox}`}>
                  <Controller
                    control={control}
                    name="is_generic"
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value}
                        checkedChildren={"Обобщенный"}
                        unCheckedChildren={"Частный"}
                        onChange={(e) => {
                          field.onChange(e);
                          // @ts-ignore: Unreachable code error
                          setValue("department_id", undefined);
                        }}
                        disabled={disabledOrder}
                        title={field.value ? "Обобщенный": "Частный"}
                      />
                    )}
                  />
                </div>
              )}
              {errors.order_type && (
                <p className={style.error}>{errors.order_type?.message}</p>
              )}
            </div>
          )}

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
                  disabled={disabledOrder || (orderType === undefined && (GetMeData?.role?.role_name === "user_purchase" ||
                    GetMeData?.role?.role_name === "admin"))}
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
                    checked={field.value}
                    checkedChildren={"ОМС"}
                    unCheckedChildren={"ПУ"}
                    disabled={disabledOrder}
                    title={field.value ? "ОМС": "ПУ"}
                  />
                )}
              />
            </div>
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
                    if (getValues("department_id")) {
                      // @ts-ignore: Unreachable code error
                      setValue("department_id", undefined);
                    }
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
                  onChange={(value, option) => {
                    // @ts-ignore: Unreachable code error
                    setValue("department_id.value", value);
                    // @ts-ignore: Unreachable code error
                    field.onChange({ value: value, label: option.label });
                  }}
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
                  options={optionsProductGroup}
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
