import { db } from "@/db/db";
import { IOrderItemFormValues } from "@/interface/orderItem";
import { IProductTableFormValues } from "@/interface/productTable";
import { Input, Select } from "antd";
import { useLiveQuery } from "dexie-react-hooks";
import React, { useMemo } from "react";
import {
  Control,
  Controller,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayReplace,
  UseFormGetValues,
  useWatch,
} from "react-hook-form";
import style from "./ModalSelectProductOrder.module.scss";

interface Props {
  getValues: UseFormGetValues<IOrderItemFormValues>;
  control: Control<any, any>;
  getValuesModal: UseFormGetValues<IProductTableFormValues>;
  errors: FieldErrors<IProductTableFormValues>;
  fields: FieldArrayWithId<IProductTableFormValues, "buyers" | "product.directory_unit_measurement", "id">[]
  replace: UseFieldArrayReplace<IProductTableFormValues, "buyers" | "product.directory_unit_measurement">
}

export default function SelectEmployeeAndQuantity({
  control,
  getValues,
  fields,
  replace,
}: Props) {

  const product_quantity = useWatch({
    control: control, // 👈 правильный control
    name: "product_quantity",
  });
  const GetMeData = useLiveQuery(() => db.getMe.toCollection().first(), []);

  const employees =
    GetMeData?.employee?.parlors
      ?.filter((parlor) =>
        parlor.employees.some(
          (employee) => employee.buyer_id === getValues("employee_id.value")
        )
      )
      ?.flatMap((parlor) => parlor.employees) || [];

  const optionsEmployees = useMemo(() => {
    const employeeSet = new Set<number>();
    return employees
      .filter((employee) => {
        if (employee.buyer_type === "employee") {
          if (employeeSet.has(employee.buyer_id)) return false;
          employeeSet.add(employee.buyer_id);
          return true;
        }
        return false;
      })
      .map((employee) => ({
        value: employee.buyer_id,
        label: employee.buyer_name,
      }));
  }, [employees]);



  return (
    <>
      {/* Выбор сотрудников */}

      <Select
        mode="multiple"
        placeholder="Выберите сотрудников"
        //@ts-ignore
        value={fields.map((f) => f.employee_id)}
        options={optionsEmployees}
        onChange={(selectedIds) => {
          const totalQuantity = Number(product_quantity) || 0;
          const baseQuantity = totalQuantity / (selectedIds.length || 1);

          // Сохраняем как строку — чтобы контролы input получали строку
          const updated = selectedIds.map((id: number) => ({
            // не даём useFieldArray генерировать старые id — пусть он сгенерирует новые
            employee_id: id,
            product_quantity: baseQuantity,
          }));

          replace(updated);
        }}
      />

      {/* Количество для каждого выбранного сотрудника */}
      {fields.map((buyer: any, index: number) => {
        const employee = optionsEmployees.find(
          (opt) => opt.value === buyer.employee_id
        );
        if (!employee) return null;

        return (
          <div
            key={buyer.employee_id + buyer.product_quantity}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 100px",
              alignItems: "center",
              gap: "12px",
              padding: "6px 0",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontWeight: 500,
              }}
              title={employee.label}
            >
              {employee.label}
            </span>

            <Controller
              control={control}
              name={`buyers.${index}.product_quantity`}
              defaultValue={buyer.product_quantity ?? ""} // <- важно
              rules={{
                required: { value: true, message: "Количество обязательно" },
                validate: (value) => {
                  const num = parseFloat(value);
                  if (isNaN(num)) return "Введите корректное число";
                  if (num <= 0) return "Количество должно быть больше 0";
                  return true;
                },
              }}
              render={({ field, fieldState }) => (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Input
                    {...field}
                    value={field.value ?? ""} // на всякий случай
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^[0-9]*\.?[0-9]*$/.test(value)) {
                        field.onChange(value);
                      }
                    }}
                    onKeyPress={(e) => {
                      if (!/[0-9.]/.test(e.key)) e.preventDefault();
                    }}
                    placeholder="Кол-во"
                    style={{ width: "100%", textAlign: "center" }}
                  />
                  {fieldState.error && (
                    <span className={style.errorEmployees}>
                      {fieldState.error.message}
                    </span>
                  )}
                </div>
              )}
            />
          </div>
        );
      })}
    </>
  );
}
