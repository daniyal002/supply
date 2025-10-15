import { db } from "@/db/db";
import { IOrderItemFormValues } from "@/interface/orderItem";
import { IProductTableFormValues } from "@/interface/productTable";
import { Input, Select } from "antd";
import { useLiveQuery } from "dexie-react-hooks";
import React, { useEffect, useMemo } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormGetValues,
  useWatch,
} from "react-hook-form";
import style from "./ModalSelectProductOrder.module.scss";

interface Props {
  getValues: UseFormGetValues<IOrderItemFormValues>;
  control: Control<any, any>;
  getValuesModal: UseFormGetValues<IProductTableFormValues>;
  errors: FieldErrors<IProductTableFormValues>;
}

export default function SelectEmployeeAndQuantity({
  control,
  getValues,
  getValuesModal,
  errors,
}: Props) {
  const [open, setOpen] = React.useState(false);

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

  const buyersWatch =
    useWatch({
      control,
      name: "buyers",
    }) || [];

  return (
    <>
      {/* Выбор сотрудников */}
      <Controller
        control={control}
        name="buyers"
        render={({ field }) => (
          <Select
            mode="multiple"
            placeholder="Выберите сотрудников"
            value={buyersWatch.map((b: any) => b.employee_id)}
            options={optionsEmployees}
            onChange={(selectedIds) => {
              const prev = buyersWatch || [];
              const baseQuantity = getValuesModal("product_quantity") || 0;

              // Добавляем новых сотрудников, сохраняя старые product_quantity
              const updated = selectedIds.map((id: number, idx: number) => {
                console.log(idx);
                const existing = prev.find((b: any) => b.employee_id === id);
                return (
                  existing ?? {
                    employee_id: id,
                    product_quantity: idx === 0 ? baseQuantity : 0,
                  }
                );
              });

              field.onChange(updated);
              setOpen(false); // закрываем список после выбора
            }}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            open={open}
            onDropdownVisibleChange={setOpen}
          />
        )}
      />

      {/* Количество для каждого выбранного сотрудника */}
      {buyersWatch.map((buyer: any, index: number) => {
        const employee = optionsEmployees.find(
          (opt) => opt.value === buyer.employee_id
        );
        if (!employee) return null;

        return (
          <div
            key={buyer.employee_id}
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
                    type="text"
                    placeholder="Кол-во"
                    style={{ width: "100%", textAlign: "center" }}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^[0-9]*\.?[0-9]*$/.test(value)) {
                        field.onChange(value);
                      }
                    }}
                    onKeyPress={(e) => {
                      if (!/[0-9.]/.test(e.key)) e.preventDefault();
                    }}
                  />
                  {/* Отображение ошибки */}
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
