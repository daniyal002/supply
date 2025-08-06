import { Button, Input, Modal, Select } from "antd";
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
import { useAllMesument, useProductData } from "@/hook/productHook";
import { IProductTableFormValues } from "@/interface/productTable";
import { IOrderItemFormValues } from "@/interface/orderItem";
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
  isNewProduct: boolean;
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
  isNewProduct,
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
  const { allMesument } = useAllMesument();
  const GetMeData = useLiveQuery(() => db.getMe.toCollection().first(), []);

  const employeeIdWatch = watch("employee_id.value");

  const itemProductData = productData?.find(
    (product) => product.product_id === productId
  );
  const [buyerType, setBuyerType] = useState<string>();

  const onSubmit: SubmitHandler<IProductTableFormValues> = (data) => {
    const unit = itemProductData?.directory_unit_measurement.find(
      (item) =>
        item.unit_measurement.unit_measurement_id ===
        getValuesModal("unit_measurement.value")
    );
    const doctors = employees.filter((buyer) =>
      getValuesModal("buyers")?.some(
        (selectEmployee) => selectEmployee.value === buyer.buyer_id
      )
    );
    const newUnitMesurement = {
      unit_measurement: {
        unit_measurement_id: data.unit_measurement.value,
        unit_measurement_name: data.unit_measurement.label,
      },
    };
    const productTable = {
      ...data,
      product: itemProductData,
      buyers: doctors,
      unit_measurement: isNewProduct ? newUnitMesurement : unit,
    };

    const products = getValues("order_products") || [];

    if (editProductId !== null && editProductId !== undefined) {
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
  }, [getValues("employee_id.value"),GetMeData]);

  useEffect(() => {
    if (type === "Добавить") {
      reset({
        product: undefined,
        buyers: undefined,
        product_quantity: undefined,
        order_product_link: undefined,
        order_product_name: undefined,
        unit_measurement: undefined,
        note: undefined,
      });
    } else if (type === "Изменить" && editProductId !== null) {
      const products = getValues("order_products") || [];
      const productToEdit = products[editProductId as number];
      reset({
        product: itemProductData,
        product_quantity: productToEdit?.product_quantity,
        unit_measurement: {
          value:
            productToEdit?.unit_measurement?.unit_measurement
              .unit_measurement_id,
          label:
            productToEdit?.unit_measurement?.unit_measurement
              ?.unit_measurement_name,
        },
        buyers: productToEdit?.buyers?.map((emp: any) => ({
          value: emp.buyer_id,
          label: emp.buyer_name,
        })),
        order_product_name: productToEdit?.order_product_name,
        order_product_link: productToEdit?.order_product_link,
        note: productToEdit?.note,
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
        value: employee.buyer_id,
        label: employee.buyer_name,
      }));
  }, [employees]);

  const optionsUnit = useMemo(() => {
    if (isNewProduct) {
      // Если allMesument пуст, добавляем placeholder-опцию
      if (!allMesument || allMesument.length === 0) {
        return [{ value: 0, label: "Единица измерения" }];
      }
      return allMesument.map((unit) => ({
        value: unit.unit_measurement_id,
        label: unit.unit_measurement_name,
      }));
    } else {
      return (
        itemProductData?.directory_unit_measurement?.reduce((acc, item) => {
          const id = item.unit_measurement.unit_measurement_id;
          const existing = acc.find((opt) => opt.value === id);
          if (!existing) {
            acc.push({
              value: id as number,
              label: `${item.unit_measurement.unit_measurement_name}(${item.coefficient} ${itemProductData.unit_measurement.unit_measurement_name})`,
            });
          }
          return acc;
        }, [] as { value: number; label: string }[]) || []
      );
    }
  }, [isNewProduct, allMesument, itemProductData]);

  const closeModal = () => {
    setIsModalOpen(false);
    reset();
  }

  return (
    <Modal
      title={
        !isNewProduct
          ? `${type} ${itemProductData?.product_name}`
          : "Новый товар - если вы не нашли товар по подбору"
      }
      open={isModalOpen}
      onCancel={() => closeModal()}
      maskClosable={false}
      footer={(null)}
      mask={true}
    >
      <form onSubmit={handleSubmit(onSubmit)} className={style.modalForm}>
        {isNewProduct && (
          <>
            <div className={style.formItem}>
              <label className={style.formItemLabel}>Ссылка на товар</label>
              <Controller
                name="order_product_link"
                control={control}
                rules={{
                  required: {
                    value: isNewProduct,
                    message: "Ссылка обязательна",
                  },
                  pattern: {
                    value: /^https?:\/\//,
                    message: "Вводить можно только ссылку",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    placeholder="Ссылка на товар"
                    className={style.modalName}
                  />
                )}
              />

              {errors.order_product_link && (
                <p className={style.error}>
                  {errors.order_product_link.message}
                </p>
              )}
            </div>

            <div className={style.formItem}>
              <label className={style.formItemLabel}>Наименование товара</label>
              <Controller
                name="order_product_name"
                control={control}
                rules={{
                  required: {
                    value: isNewProduct,
                    message: "Наименование товара обязательна",
                  },
                }}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="Наименование товара"
                    className={style.modalName}
                    {...field}
                  />
                )}
              />

              {errors.order_product_name && (
                <p className={style.error}>
                  {errors.order_product_name.message}
                </p>
              )}
            </div>
          </>
        )}



        <div className={style.formItem}>
          <label className={style.formItemLabel}>
            Выберите Единицу измерения
          </label>
          <Controller
            control={control}
            name="unit_measurement"
            rules={{
              required: {
                value: !isNewProduct,
                message: "Выберите Единицу измерения",
              },
            }}
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Единица измерения"
                options={optionsUnit}
                onChange={(value, option) => {
                  // @ts-ignore: Unreachable code error
                  field.onChange({ value, label: option.label });
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
          {errors.unit_measurement && (
            <p className={style.error}>{errors.unit_measurement.message}</p>
          )}
        </div>

        <div className={style.formItem}>
          <label className={style.formItemLabel}>Количество</label>
          <Controller
            name="product_quantity"
            control={control}
            rules={{
              required: { value: true, message: "Количество обязательно" },
              pattern: {
                value: /^[0-9]*\.?[0-9]+$/, // Обновленное регулярное выражение для целых и дробных чисел
                message: "Введите корректное число", // Сообщение об ошибке
              },
            }}
            render={({ field }) => (
              <Input
                type="text"
                placeholder="Количество"
                className={style.modalName}
                {...field}
              />
            )}
          />

          {errors.product_quantity && (
            <p className={style.error}>{errors.product_quantity.message}</p>
          )}
        </div>

        {buyerType === "parlor" && (
          <div className={style.formItem}>
            <label className={style.formItemLabel}>Выберите сотрудника</label>
            <Controller
              control={control}
              name="buyers"
              rules={
                {
                  // required: {
                  //   value: buyerType === "parlor" ? true : false,
                  //   message: "Выберите врача",
                  // },
                }
              }
              render={({ field }) => (
                <Select
                  {...field}
                  mode="multiple"
                  options={optionsEmployees}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  placeholder="сотрудник"
                  autoClearSearchValue={false}
                  onChange={(value, option) => field.onChange(option)} // Передаём только значение
                />
              )}
            />
          </div>
        )}
        <div className={style.formItem}>
          <label className={style.formItemLabel}>Примечание</label>
          <Controller
            control={control}
            name="note"
            render={({ field }) => (
              <Input.TextArea
                placeholder="Примечание"
                className={style.modalTextArea}
                {...field}
              />
            )}
          />
        </div>

        <button type="submit" className={style.modalSubmit}>
          {type}
        </button>
        {/* <button  className={style.modalClose} onClick={() => closeModal()}>Отмена</button> */}
      </form>
    </Modal>
  );
};

export default ModalSelectProductOrder;
