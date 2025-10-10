import { db } from "@/db/db";
import { Input, Select } from "antd";
import { useLiveQuery } from "dexie-react-hooks";
import React, { useMemo } from "react";
import {
  Control,
  Controller,
  UseFormGetValues,
  useWatch,
} from "react-hook-form";

interface Props {
  getValues: UseFormGetValues<any>;
  control: Control<any, any>;
}

export default function SelectEmployeeAndQuantity({
  control,
  getValues,
}: Props) {
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

  const buyersWatch = useWatch({
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

              // Добавляем новых сотрудников, сохраняя старые product_quantity
              const updated = selectedIds.map((id: number) => {
                const existing = prev.find((b: any) => b.employee_id === id);
                return existing ?? { employee_id: id, product_quantity: 1 };
              });

              field.onChange(updated);
            }}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
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
            //   defaultValue={buyer.product_quantity ?? 1}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  min={1}
                  placeholder="Кол-во"
                  style={{
                    width: "100%",
                    textAlign: "center",
                  }}
                />
              )}
            />
          </div>
        );
      })}
    </>
  );
}
