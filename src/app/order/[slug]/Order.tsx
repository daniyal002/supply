"use client";

import { Button } from "antd";
import React, { useEffect, useState } from "react";
import style from "./Order.module.scss";
import { useCreateOrderMutation, useGetOrderById, useUpdateOrderMutation } from "@/hook/orderHook";
import { SubmitHandler, useForm } from "react-hook-form";
import { IOrderItem, IOrderItemFormValues, IOrderItemRequest } from "@/interface/orderItem";
import HeaderOrder from "./HeaderOrder";
import SelectProductOrder from "./SelectProductOrder/SelectProductOrder";
import ProductOrder from "./ProductOrder/ProductOrder";
import { useGetMe } from "@/hook/userHook";
import { addOrderIndexedDB, db, deleteOrderIndexedDB } from "@/db/db";
import { useLiveQuery } from "dexie-react-hooks";

interface Props {
  orderid?: string;
  type: "Добавить" | "Изменить";
}

export default function Order({ orderid, type }: Props) {
  const [toggle, setToggle] = useState<boolean>(false);
  const { mutate: createOrderMutation } = useCreateOrderMutation();
  const { mutate: updateOrderMutation } = useUpdateOrderMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    getValues,
    setValue,
    watch,
    resetField,
  } = useForm<IOrderItemFormValues>({ mode: "onChange" });
  const { getOrderByIdData } = useGetOrderById(orderid as string);

  const GetMeData = useLiveQuery(() => db.getMe.toCollection().first(), []);

  const productsWatch = watch("order_products");

  useEffect(()=>{
    if(orderid === "newOrder" || orderid === `draft${Number(orderid?.split("draft").join(""))}`){

    const buyer = GetMeData?.employee?.parlors
    ?.filter((parlor) =>
      parlor.employees.some(
        (employee) => employee.buyer_id === getValues("employee_id.value")
      )
    )
    ?.flatMap((parlor) => parlor.employees).find(employee => employee.buyer_id === getValues("employee_id.value"))
    const department = GetMeData?.employee?.parlors
    ?.filter((parlor) =>
      parlor.employees.some(
        (employee) => employee.buyer_id === getValues("employee_id.value")
      )
    )
    ?.flatMap((parlor) => parlor.department).find(department => department?.department_id === getValues("department_id.value"))
    const userId = GetMeData?.user_id

    const data:IOrderItem = {
      // @ts-ignores
      buyer:buyer,
      department:department,
      oms:getValues("oms") === undefined ? false : getValues("oms"),
      note:getValues("note"),
      order_products:getValues("order_products"),
      // order_route_id:getValues("order_route_id"),
      order_status:{order_status_id:99,order_status_name:"Черновик"},
      created_at:Date(),
      user_id:userId
    }
    if(getValues("order_products")){
      addOrderIndexedDB(data,userId as number)
    }
  }

  },[productsWatch])

  useEffect(() => {
    resetField("department_id", { defaultValue: undefined });

    const buyerType = GetMeData?.employee?.parlors
    ?.filter((parlor) =>
      parlor.employees.some(
        (employee) => employee.buyer_id === getValues("employee_id.value")
      )
    )
    ?.flatMap((parlor) => parlor.employees).find(employee => employee.buyer_id === getValues("employee_id.value"))?.buyer_type

    if(buyerType === "employee"){
      setValue("order_products", getValues("order_products")?.map(product => ({ ...product, buyers: [] })) || [])
    }
  }, [getValues("employee_id")]);

  const onSubmit: SubmitHandler<IOrderItemFormValues> = (data) => {
    console.log(data);
    const order: IOrderItemRequest = {
      department_id: data.department_id.value,
      employee_id: data.employee_id.value,
      oms: data.oms,
      order_route_id: 1,
      order_status_id: 1,
      note: data.note,
      product_group_id:data.product_group.value,
      products: data.order_products.map((product) => ({
        product_id: product.product.product_id,
        product_quantity: product.product_quantity,
        unit_measurement_id: product.unit_measurement.unit_measurement
          .unit_measurement_id as number,
        note: product.note,
        employee_ids: product.buyers?.map((buyer) => buyer.buyer_id),
      })),
    };
    if(orderid !== "newOrder" && getOrderByIdData){
      order.order_id = Number(orderid)
      updateOrderMutation(order)
    }else{
      createOrderMutation(order);
      deleteOrderIndexedDB(GetMeData?.user_id as number)
    }
  };

  useEffect(() => {
    if (orderid === undefined) {
      reset({
        employee_id: undefined,
        department_id: undefined,
        oms: false,
        order_products: undefined,
      });

    } else if (orderid !== "newOrder" && orderid !== "draft" ) {
      reset({
        order_id: getOrderByIdData?.order_id,
        employee_id: {
          value: getOrderByIdData?.buyer?.buyer_id,
          label: getOrderByIdData?.buyer?.buyer_name,
        },
        department_id: {
          value: getOrderByIdData?.department?.department_id,
          label: getOrderByIdData?.department?.department_name,
        },
        product_group:{
          value: getOrderByIdData?.product_group?.product_group_id,
          label: getOrderByIdData?.product_group?.product_group_name,
        },
        oms: getOrderByIdData?.oms,
        order_route_id: 1,
        order_status_id: getOrderByIdData?.order_status.order_status_id,
        note: getOrderByIdData?.note,
        order_products: getOrderByIdData?.order_products,
      });
    }
  }, [reset, type, orderid, getOrderByIdData]);

  if(orderid === `draft${Number(orderid?.split("draft").join(""))}`){
    const orderDraftItem = useLiveQuery(() => db.orderItem.get(Number(orderid?.split("draft").join(""))));

    useEffect(() => {
       if (orderid !== "newOrder" && orderid === `draft${Number(orderid?.split("draft").join(""))}` ){
        if(orderDraftItem){
          reset({
            // order_id: orderDraftItem[0]?.order_id,
            employee_id: {
              value: orderDraftItem?.buyer?.buyer_id,
              label: orderDraftItem?.buyer?.buyer_name,
            },
            department_id: {
              value: orderDraftItem?.department?.department_id,
              label: orderDraftItem?.department?.department_name,
            },
            oms: orderDraftItem?.oms,
            order_route_id: 1,
            order_status_id: orderDraftItem?.order_status.order_status_id,
            note: orderDraftItem?.note,
            order_products: orderDraftItem?.order_products,
          });
        }
      }
    }, [ orderDraftItem]);
  }


  return (
    <div className={style.newOrder}>
      <h1>{orderid === "newOrder" ? "Новая заявка" : orderid === `draft${Number(orderid?.split("draft").join(""))}` ? "Черновик":`Заявка №-${getOrderByIdData?.order_number}`}</h1>


      <div
        className={
          toggle
            ? `${style.active} ${style.selectProductOrder}`
            : style.selectProductOrder
        }
      >
        <button onClick={() => setToggle(!toggle)} className={style.toggleBtn}>
        {toggle ? "Список выбранных товаров" : "Подбор товара"}
      </button>
        <SelectProductOrder
          watch={watch}
          getValues={getValues}
          setValue={setValue}
        />
      </div>

      <div
        className={
          !toggle ? `${style.active} ${style.productOrder}` : style.productOrder
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
        <button type="submit" className={style.buttonOrderCreate}>{orderid === "newOrder" || orderid ===`draft${Number(orderid?.split("draft").join(""))}` ? "Создать" : "Изменить"}</button>
        </form>
        {getValues("product_group.value") && (
          <button onClick={() => setToggle(!toggle)} className={style.toggleBtn}>
          {toggle ? "Список выбранных товаров" : "Подбор товара"}
        </button>
        )}
        <ProductOrder
          productTableData={getValues("order_products")}
          getValues={getValues}
          setValue={setValue}
          watch={watch}
        />
      </div>
    </div>
  );
}
