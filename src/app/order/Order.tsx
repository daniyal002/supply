"use client";

import { Button } from "antd";
import React, { useEffect, useState } from "react";
import style from "./Order.module.scss";
import { useCreateOrderMutation } from "@/hook/orderHook";
import { SubmitHandler, useForm } from "react-hook-form";
import { IOrderItemFormValues, IOrderItemRequest } from "@/interface/orderItem";
import HeaderOrder from "./HeaderOrder";
import SelectProductOrder from "./SelectProductOrder/SelectProductOrder";
import ProductOrder from "./ProductOrder/ProductOrder";

interface Props {
  orderid?: number;
  type: "Добавить" | "Изменить";
}

export default function Order({ orderid, type }: Props) {
  const [toggle, setToggle] = useState<boolean>(false);
  const { mutate: createOrderMutation } = useCreateOrderMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    getValues,
    setValue,
    watch,
  } = useForm<IOrderItemFormValues>({ mode: "onChange" });
  const productsWatch = watch("products");
  const onSubmit: SubmitHandler<IOrderItemFormValues> = (data) => {
    console.log(data);
    const order: IOrderItemRequest = {
      department_id: data.department_id.value,
      employee_id: data.employee_id.value,
      oms: data.oms,
      order_route_id: 1,
      order_status_id: 1,
      note:data.note,
      products: data.products.map((product) => ({
        product_id: product.product.product_id,
        product_quantity: product.product_quantity,
        unit_measurement_id: product.unitProductTable.unit_measurement.id as number,
        note:product.note,
        employee_ids: product.employee?.map(employee => employee.id),
      })),
    };
    createOrderMutation(order);
  };

  useEffect(() => {
    if (orderid === undefined) {
      reset({
        employee_id: undefined,
        department_id: undefined,
        oms: false,
        products: undefined,
      });
    } else if (type === "Изменить") {
      reset({
        // id: itemEmployeeData?.id,
        // buyer_name: itemEmployeeData.buyer_name,
        // buyer_type: {value:itemEmployeeData.buyer_type},
        // post: {
        //   value: itemEmployeeData?.post?.id,
        //   label: itemEmployeeData?.post?.post_name,
        // },
        // parlor: itemEmployeeData?.parlor?.map(parlor => ({
        //   value: parlor?.id,
        //   label: parlor.parlor_name,
        // }))
      });
    }
  }, [reset, type, orderid]);

  return (
    <div className={style.newOrder}>
      <h1>Заявка {orderid}</h1>

      <Button onClick={() => setToggle(!toggle)}>
        {toggle ? "Список выбранных товаров" : "Подбор товара"}
      </Button>

      <div
        className={
          toggle
            ? style.selectProductOrder + style.active
            : style.selectProductOrder
        }
      >
        <SelectProductOrder
          watch={watch}
          getValues={getValues}
          setValue={setValue}
        />
      </div>

      <div
        className={
          !toggle ? style.productOrder + style.active : style.productOrder
        }
      >
        <form key={1} onSubmit={handleSubmit(onSubmit)}>
          <HeaderOrder
            control={control}
            register={register}
            getValues={getValues}
            setValue={setValue}
            watch={watch}
            errors={errors}
          />
          <ProductOrder
            productTableData={getValues("products")}
            getValues={getValues}
            setValue={setValue}
            watch={watch}
          />
          <button type="submit">Создать</button>
        </form>
      </div>
    </div>
  );
}
