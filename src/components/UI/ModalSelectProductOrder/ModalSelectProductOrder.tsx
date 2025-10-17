import { Input, message, Modal, Select } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
  UseFormGetValues,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import style from "./ModalSelectProductOrder.module.scss";
import { useAllMesument, useProductData } from "@/hook/productHook";
import {
  IEmployeeFromProductTable,
  IProductTable,
  IProductTableFormValues,
} from "@/interface/productTable";
import { IOrderItemFormValues } from "@/interface/orderItem";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db/db";
import SelectEmployeeAndQuantity from "./SelectEmployeeAndQuantity";
import { IProductUnit } from "@/interface/product";
import { IUnit } from "@/interface/unit";

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
    handleSubmit,
    formState: { errors },
    reset,
    control,
    getValues: getValuesModal,
    watch: watchModal,
    setValue: setModalValue,
  } = useForm<IProductTableFormValues>({ mode: "onChange" });
  const { productData } = useProductData();
  const { allMesument } = useAllMesument();
  const GetMeData = useLiveQuery(() => db.getMe.toCollection().first(), []);
  const [disabledQuantity, setDisabledQuantity] = useState(false);

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

    const doctors = getValuesModal("buyers")?.map((buyer) => {
      const employee = employees.find(
        (emp) => emp.buyer_id === buyer.employee_id
      );
      return {
        buyer_id: employee?.buyer_id,
        buyer_name: employee?.buyer_name,
        buyer_type: employee?.buyer_type,
        product_quantity: buyer.product_quantity,
      };
    });

    const newUnitMesurement = {
      unit_measurement: {
        unit_measurement_id: data.unit_measurement.value,
        unit_measurement_name: data.unit_measurement.label,
      },
    };
    const productTable: IProductTable = {
      ...data,
      product: (!isNewProduct && itemProductData) as IProductUnit,
      buyers: doctors as IEmployeeFromProductTable[],
      unit_measurement: isNewProduct
        ? (newUnitMesurement as IUnit)
        : (unit as IUnit),
      product_quantity: data.product_quantity
        ? Number(data.product_quantity)
        : doctors?.reduce(
            (acc, cur) => acc + (Number(cur.product_quantity) || 0),
            0
          ) || 0,
    };

    const products = getValues("order_products") || [];

    if (editProductId !== null && editProductId !== undefined) {
      const updatedProducts = products.map((product, index) =>
        index === editProductId ? productTable : product
      );
      // @ts-ignore: Unreachable code error
      setValue("order_products", updatedProducts);
    } else {
      if (
        products.some(
          (p) => p.product.product_id === productTable.product.product_id
        ) &&
        !isNewProduct
      ) {
        message.warning("Товар уже добавлен в заявку!");
      } else {
        // @ts-ignore: Unreachable code error
        setValue("order_products", [...products, productTable]);
      }
    }
    reset();
    replace([]);
    setIsModalOpen(false);
  };

  const buyersWatch = watchModal("buyers") || [];

  useEffect(() => {
    if (buyersWatch.length === 0) {
      setDisabledQuantity(false);
      return;
    } // <--- добавляем защиту

    const hasBuyers = buyersWatch.length > 0;
    setDisabledQuantity(hasBuyers);

    const totalQuantity = buyersWatch.reduce(
      (acc, cur) => acc + (Number(cur.product_quantity) || 0),
      0
    );

    setModalValue("product_quantity", totalQuantity);
  }, [buyersWatch.length, JSON.stringify(buyersWatch)]);

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
  }, [getValues("employee_id.value"), GetMeData]);

  useEffect(() => {
    if (type === "Добавить") {
      reset({
        product: undefined,
        buyers: [],
        product_quantity: undefined,
        order_product_link: undefined,
        order_product_name: undefined,
        unit_measurement: defaultUnit,
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
        buyers: productToEdit?.buyers?.map((emp) => ({
          employee_id: emp.buyer_id,
          product_quantity: emp.product_quantity,
        })),
        order_product_name: productToEdit?.order_product_name,
        order_product_link: productToEdit?.order_product_link,
        note: productToEdit?.note,
      });
    }
  }, [type, reset, editProductId, isModalOpen]);

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

  const defaultUnit = useMemo(() => {
    if (isNewProduct || !itemProductData?.directory_unit_measurement?.length) {
      return undefined;
    }

    const maxUnit = itemProductData.directory_unit_measurement.reduce(
      (prev, current) =>
        (prev.coefficient || 0) > (current.coefficient || 0) ? prev : current
    );

    return {
      value: maxUnit.unit_measurement.unit_measurement_id,
      label: `${maxUnit.unit_measurement.unit_measurement_name}(${maxUnit.coefficient} ${itemProductData.unit_measurement.unit_measurement_name})`,
    };
  }, [isNewProduct, itemProductData, allMesument]);

  const closeModal = () => {
    reset({
      product: undefined,
      buyers: [],
      product_quantity: undefined,
      order_product_link: undefined,
      order_product_name: undefined,
      unit_measurement: defaultUnit,
      note: undefined,
    });
    setIsModalOpen(false);
  };

  const { fields, replace } = useFieldArray<IProductTableFormValues>({
    control,
    name: "buyers",
  });

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
      footer={null}
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
              validate: (value) =>
                value?.value !== undefined && value?.value !== null
                  ? true
                  : "Выберите единицу измерения",
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
                defaultValue={!isNewProduct && defaultUnit}
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
            disabled={disabledQuantity}
            rules={{
              required: { value: true, message: "Количество обязательно" },
              validate: (value) => {
                const num = parseFloat(String(value));
                if (isNaN(num)) return "Введите корректное число";
                if (num <= 0) return "Количество должно быть больше 0";
                return true;
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                placeholder="Количество"
                className={style.modalName}
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
            )}
          />

          {errors.product_quantity && (
            <p className={style.error}>{errors.product_quantity.message}</p>
          )}
        </div>

        {buyerType === "parlor" && (
          <div className={style.formItem}>
            <label className={style.formItemLabel}>Выберите сотрудника</label>
            <SelectEmployeeAndQuantity
              control={control}
              getValues={getValues}
              getValuesModal={getValuesModal}
              errors={errors}
              fields={fields}
              replace={replace}
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
      </form>
    </Modal>
  );
};

export default ModalSelectProductOrder;
