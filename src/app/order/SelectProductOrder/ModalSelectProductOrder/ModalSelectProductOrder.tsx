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
  const { GetMeData } = useGetMe();
  const employeeIdWatch = watch("employee_id.value");
  const itemProductData = productData?.find(
    (product) => product.product_id === productId
  );
  const [buyerType, setBuyerType] = useState<string>();

  const onSubmit: SubmitHandler<IProductTableFormValues> = (data) => {
    console.log(data);
    const unit = itemProductData?.directory_unit_measurement.find(
      (item) =>
        item.unit_measurement.id === getValuesModal("unitProductTable.value")
    );
    const doctors = employees.filter((employee) =>
      getValuesModal("employee")?.some(
        (selectEmployee) => selectEmployee.value === employee.id
      )
    );

    const productTable = {
      ...data,
      product: itemProductData,
      employee: doctors,
      unitProductTable: unit,
    };
    const products = getValues("products") || [];

    if (editProductId !== null) {
      console.log("editProductId", editProductId);

      const updatedProducts = products.map((product, index) =>
        index === editProductId ? productTable : product
      );
      // @ts-ignore: Unreachable code error
      setValue("products", updatedProducts);
    } else {
      // @ts-ignore: Unreachable code error
      setValue("products", [...products, productTable]);
    }
    reset();
    setIsModalOpen(false);
  };

  const employees =
    GetMeData?.employee?.parlor
      ?.filter((parlor) =>
        parlor.employees.some(
          (employee) => employee.id === getValues("employee_id.value")
        )
      )
      ?.flatMap((parlor) => parlor.employees) || [];

  useEffect(() => {
    const employee = GetMeData?.employee.parlor
      ?.filter((parlor) =>
        parlor.employees.some(
          (employee) => employee.id === getValues("employee_id.value")
        )
      )
      .flatMap((parlor) => parlor.employees)
      .find((employee) => employee.id === getValues("employee_id.value"));
    if (employee) {
      setBuyerType(employee?.buyer_type);
    }
  }, [getValues("employee_id.value")]);

  useEffect(() => {
    console.log(editProductId);
    if (type === "Добавить") {
      reset({
        product: undefined,
        employee: undefined,
        product_quantity: undefined,
        unitProductTable: undefined,
        note:undefined,
      });
    } else if (type === "Изменить" && editProductId !== null) {
      const products = getValues("products") || [];
      const productToEdit = products[editProductId as number];
      console.log(productToEdit);
      reset({
        product: itemProductData,
        product_quantity: productToEdit?.product_quantity,
        unitProductTable: {
          value: productToEdit?.unitProductTable?.id,
          label: productToEdit?.unitProductTable?.unit_measurement?.name,
        },
        employee: productToEdit?.employee?.map((emp: any) => ({
          value: emp.id,
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
          if (employeeSet.has(employee.id)) {
            return false;
          } else {
            employeeSet.add(employee.id);
            return true;
          }
        }
      })
      .map((employee) => ({
        value: employee.id,
        label: employee.buyer_name,
      }));
  }, [employees]);

  const optionsUnit = useMemo(
    () =>
      itemProductData?.directory_unit_measurement?.map((item) => ({
        value: item.unit_measurement.id,
        label: `${item.unit_measurement.name}(${item.coefficient} ${itemProductData.unit_measurement.name})`,
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
            name="unitProductTable"
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
          {errors.unitProductTable && (
            <p className={style.error}>{errors.unitProductTable.message}</p>
          )}
        </div>
        {buyerType === "parlor" && (
          <div className={style.formItem}>
            <label className={style.formItemLabel}>Выберите врача</label>
            <Controller
              control={control}
              name="employee"
              rules={{
                required: {
                  value: buyerType === "parlor" ? true : false,
                  message: "Выберите врача",
                },
              }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={optionsEmployees}
                  onChange={(value, option) => field.onChange(option)}
                  mode="multiple"
                  placeholder="Врач"
                />
              )}
            />
            {errors.employee && (
              <p className={style.error}>{errors.employee.message}</p>
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
