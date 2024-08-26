import { Modal, Select } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import {
  Controller,
  SubmitHandler,
  useForm,
  UseFormGetValues,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import style from "./ModalSelectProductOrder.module.scss";
import { useProductData } from "@/hook/productHook";
import { IProductTableFormValues } from "@/interface/productTable";
import { IOrderItemFormValues } from "@/interface/orderItem";
import { useGetMe } from "@/hook/userHook";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db/db";

interface Props {
  type: "Добавить" | "Изменить";
  productId?: number;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  watch: UseFormWatch<IOrderItemFormValues>;
  getValues: UseFormGetValues<IOrderItemFormValues>;
  setValue: UseFormSetValue<IOrderItemFormValues>;
  editProductId: number | null;
}

const ModalSelectProductOrder: React.FC<Props> = ({
  type,
  productId,
  isModalOpen,
  setIsModalOpen,
  watch,
  getValues,
  setValue,
  editProductId,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    getValues: getValuesModal,
  } = useForm<IProductTableFormValues>({ mode: "onChange" });
  const { productData } = useProductData();
  const GetMeData = useLiveQuery(() => db.getMe.toCollection().first(), []);

  const employeeIdWatch = watch("employee_id.value");
  
  const itemProductData = productData?.find(
    (product) => product.product_id === productId
  );
  const [buyerType, setBuyerType] = useState<string>();


  const onSubmit: SubmitHandler<IProductTableFormValues> = (data) => {
    console.log(data)
    const unit = itemProductData?.directory_unit_measurement.find(
      (item) =>
        item.unit_measurement.unit_measurement_id === getValuesModal("unit_measurement.value")
    );
    const doctors = employees.filter((buyer) =>
      getValuesModal("buyers")?.some(
        (selectEmployee) => selectEmployee.value === buyer.buyer_id
      )
    );

    const productTable = {
      ...data,
      product: itemProductData,
      buyers: doctors,
      unit_measurement: unit,
    };
    console.log(productTable)

    const products = getValues("order_products") || [];

    if (editProductId !== null) {
      const updatedProducts = products.map((product, index) =>
        index === editProductId ? productTable : product
      );
      // @ts-ignore: Unreachable code error
      setValue("order_products", updatedProducts);
    } else {
      // @ts-ignore: Unreachable code error
      setValue("order_products", [...products, productTable]);
    }
    reset();
    setIsModalOpen(false);
  };

  const employees =
    GetMeData?.employee?.parlors
      ?.filter((parlor) =>
        parlor.employees.some(
          (employee) => employee.buyer_id === getValues("employee_id.value")
        )
      )
      ?.flatMap((parlor) => parlor.employees) || [];

  useEffect(() => {
    const employee = GetMeData?.employee.parlors
      ?.filter((parlor) =>
        parlor.employees.some(
          (employee) => employee.buyer_id === getValues("employee_id.value")
        )
      )
      .flatMap((parlor) => parlor.employees)
      .find((employee) => employee.buyer_id === getValues("employee_id.value"));
    if (employee) {
      setBuyerType(employee?.buyer_type);
    }
  }, [getValues("employee_id.value")]);

  useEffect(() => {
    if (type === "Добавить") {
      reset({
        product: undefined,
        buyers: undefined,
        product_quantity: undefined,
        unit_measurement: undefined,
        note:undefined,
      });
    } else if (type === "Изменить" && editProductId !== null) {
      const products = getValues("order_products") || [];
      const productToEdit = products[editProductId as number];
      reset({
        product: itemProductData,
        product_quantity: productToEdit?.product_quantity,
        unit_measurement: {
          value: productToEdit?.unit_measurement?.unit_measurement.unit_measurement_id,
          label: productToEdit?.unit_measurement?.unit_measurement?.unit_measurement_name,
        },
        buyers: productToEdit?.buyers?.map((emp: any) => ({
          value: emp.buyer_id,
          label: emp.buyer_name,
        })),
        note:productToEdit?.note,
      });
    }
  }, [type, reset, editProductId, isModalOpen]);

  const optionsEmployees = useMemo(() => {
    const employeeSet = new Set();
    return employees
      .filter((employee) => {
        if (employee.buyer_type === "employee") {
          if (employeeSet.has(employee.buyer_id)) {
            return false;
          } else {
            employeeSet.add(employee.buyer_id);
            return true;
          }
        }
      })
      .map((employee) => ({
        key: employee.buyer_id,
        value: employee.buyer_id,
        label: employee.buyer_name,
      }));
  }, [employees]);

  const optionsUnit = useMemo(
    () =>
      itemProductData?.directory_unit_measurement?.map((item) => ({
        value: item.unit_measurement.unit_measurement_id,
        label: `${item.unit_measurement.unit_measurement_name}(${item.coefficient} ${itemProductData.unit_measurement.unit_measurement_name})`,
      })) || [],
    [itemProductData]
  );

  return (
    <Modal
      title={`${type} ${itemProductData?.product_name}`}
      open={isModalOpen}
      onCancel={() => {
        setIsModalOpen(false);
        reset();
      }}
      footer={null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className={style.modalForm}>
        <div className={style.formItem}>
          <label className={style.formItemLabel}>Количество</label>
          <input
            type="text"
            placeholder="Количество"
            className={style.modalName}
            {...register("product_quantity", {
              required: { value: true, message: "Количество обязательно" },
              pattern: {value: /^[0-9]+$/, message: 'Вводить можно только цифры',},
            })}
          />
          {errors.product_quantity && (
            <p className={style.error}>{errors.product_quantity.message}</p>
          )}
        </div>

        <div className={style.formItem}>
          <label className={style.formItemLabel}>
            Выберите Единицу измерения
          </label>
          <Controller
            control={control}
            name="unit_measurement"
            rules={{
              required: { value: true, message: "Выберите Единицу измерения" },
            }}
            render={({ field }) => (
              <Select
                {...field}
                options={optionsUnit}
                onChange={(value, option) =>
                  // @ts-ignore: Unreachable code error
                  field.onChange({ value, label: option.label })
                }
                placeholder="Единица измерения"
              />
            )}
          />
          {errors.unit_measurement && (
            <p className={style.error}>{errors.unit_measurement.message}</p>
          )}
        </div>
        {buyerType === "parlor" && (
          <div className={style.formItem}>
            <label className={style.formItemLabel}>Выберите врача</label>
            <Controller
              control={control}
              name="buyers"
              rules={{
                required: {
                  value: buyerType === "parlor" ? true : false,
                  message: "Выберите врача",
                },
              }}
              render={({ field }) => (
                <Select
                {...field}
                mode="multiple"
                options={optionsEmployees}
                placeholder="Врач"
                onChange={(value, option) => field.onChange(option)}
              >
                {optionsEmployees.map(option => (
                  <Select.Option key={option.key} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
              )}
            />
            {errors.buyers && (
              <p className={style.error}>{errors.buyers.message}</p>
            )}
          </div>
        )}
        <div className={style.formItem}>
          <label className={style.formItemLabel}>Примечание</label>
          <textarea
            placeholder="Примечание"
            className={style.modalTextArea}
            {...register("note")}
          />
        </div>

        <button type="submit" className={style.modalSubmit}>
          {type}
        </button>
      </form>
    </Modal>
  );
};

export default ModalSelectProductOrder;
