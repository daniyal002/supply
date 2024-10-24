"use client";

import React, { useEffect } from "react";
import style from "./Order.module.scss";
import { useAgreedOrderMutation, useGetOrderById, useRejectOrderMutation } from "@/hook/orderHook";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  IOrderItemFormValues,
} from "@/interface/orderItem";
import ProductOrder from "./ProductOrder/ProductOrder";
import ApprovalHeaderOrder from "./ApprovalHeaderOrder";

interface Props {
  orderid?: string;
  type: "Добавить" | "Изменить";
  targetKey?: string;
  remove?: any;
}

export default function ApprovalOrder({
  orderid,
  type,
  remove,
  targetKey,
}: Props) {
  const {
    reset,
    watch,
    getValues,
    register,
    setValue,
    formState: { errors },
    control,
    handleSubmit,
  } = useForm<IOrderItemFormValues>({ mode: "onChange" });
  const { getOrderByIdData } = useGetOrderById(orderid as string);
  const {mutate:agreedOrderMutation} = useAgreedOrderMutation()
  const {mutate:rejectOrderMutation} = useRejectOrderMutation()
  const [note,  setnote] = React.useState('')


  const agreedOrder = (order_id:number) => {
    agreedOrderMutation({order_id,note},{onSuccess(){
      remove(targetKey)
    }})
  }

  const  rejectOrder = (order_id:number) => {
    rejectOrderMutation({order_id,note},{onSuccess(){
      remove(targetKey)
      }})
      }

  // useEffect(() => {
  //   if (
  //     orderid === "newOrder" ||
  //     orderid === `draft${Number(orderid?.split("draft").join(""))}`
  //   ) {
  //     const buyer = GetMeData?.employee?.parlors
  //       ?.filter((parlor) =>
  //         parlor.employees.some(
  //           (employee) => employee.buyer_id === getValues("employee_id.value")
  //         )
  //       )
  //       ?.flatMap((parlor) => parlor.employees)
  //       .find(
  //         (employee) => employee.buyer_id === getValues("employee_id.value")
  //       );

  //     const department = GetMeData?.employee?.parlors
  //       ?.filter((parlor) =>
  //         parlor.employees.some(
  //           (employee) => employee.buyer_id === getValues("employee_id.value")
  //         )
  //       )
  //       ?.flatMap((parlor) => parlor.department)
  //       .find(
  //         (department) =>
  //           department?.department_id === getValues("department_id.value")
  //       );

  //     const userId = GetMeData?.user_id;

  //     const data: IOrderItem = {
  //       // @ts-ignores
  //       buyer: buyer,
  //       department: department,
  //       oms: getValues("oms") === undefined ? false : getValues("oms"),
  //       note: getValues("note"),
  //       order_products: getValues("order_products"),
  //       // order_route_id:getValues("order_route_id"),
  //       order_status: { order_status_id: 99, order_status_name: "Черновик" },
  //       created_at: Date(),
  //       user_id: userId,
  //       product_group: {
  //         product_group_id: getValues("product_group.value"),
  //         product_group_name: getValues("product_group.label"),
  //       },
  //     };
  //     if (getValues("order_products")) {
  //       console.log(getValues("order_products"))
  //       addOrderIndexedDB(data, userId as number);
  //     }
  //   }
  // }, [productsWatch]);

  // useEffect(() => {
  //   resetField("department_id", { defaultValue: undefined });

  //   const buyerType = GetMeData?.employee?.parlors
  //     ?.filter((parlor) =>
  //       parlor.employees.some(
  //         (employee) => employee.buyer_id === getValues("employee_id.value")
  //       )
  //     )
  //     ?.flatMap((parlor) => parlor.employees)
  //     .find(
  //       (employee) => employee.buyer_id === getValues("employee_id.value")
  //     )?.buyer_type;

  //   if (buyerType === "employee") {
  //     setValue(
  //       "order_products",
  //       getValues("order_products")?.map((product) => ({
  //         ...product,
  //         buyers: [],
  //       })) || []
  //     );
  //   }
  // }, [getValues("employee_id")]);

  // const onSubmit: SubmitHandler<IOrderItemFormValues> = (data) => {
  //   console.log(data);
  //   if(data.order_products && data.order_products.length > 0){
  //   const order: IOrderItemRequest = {
  //     department_id: data.department_id.value,
  //     employee_id: data.employee_id.value,
  //     oms: data.oms || false,
  //     // order_route_id: 4,
  //     order_status_id: 1,
  //     note: data.note,
  //     product_group_id: data.product_group.value,
  //     products: data.order_products.map((product) => ({
  //       product_id: product.product.product_id,
  //       product_quantity: product.product_quantity,
  //       unit_measurement_id: product.unit_measurement.unit_measurement
  //         .unit_measurement_id as number,
  //       note: product.note,
  //       employee_ids: product.buyers?.map((buyer) => buyer.buyer_id),
  //     })),
  //   };
  //   if (orderid !== "newOrder" && orderid !== `draft${orderid?.split("draft")[1]}` && getOrderByIdData) {
  //     order.order_id = Number(orderid);
  //     updateOrderMutation(order,{onSuccess() {
  //       remove(targetKey)
  //     },});
  //   } else {
  //     createOrderMutation(order,{onSuccess(){
  //       remove(targetKey)
  //     }});
  //     deleteOrderIndexedDB(GetMeData?.user_id as number);
  //   }
  // }else{
  //   message.warning("Добавьте товары в заявку !")
  // }
  // };

  useEffect(() => {
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
      product_group: {
        value: getOrderByIdData?.product_group?.product_group_id,
        label: getOrderByIdData?.product_group?.product_group_name,
      },
      oms: getOrderByIdData?.oms,
      order_route_id: 1,
      order_status_id: getOrderByIdData?.order_status?.order_status_id,
      note: getOrderByIdData?.note,
      order_products: getOrderByIdData?.order_products,
    });
  }, [reset, type, orderid, getOrderByIdData]);

  const onSubmit: SubmitHandler<IOrderItemFormValues> = (data) => {
    console.log(data);
  };

  return (
    <div className={style.newOrder}>
      <h1>Заявка на согласовании №: {orderid}</h1>

      {/* <form key={1} onSubmit={handleSubmit(onSubmit)}> */}
      <ApprovalHeaderOrder
        register={register}
        getValues={getValues}
        watch={watch}
        control={control}
        errors={errors}
        setValue={setValue}
      />
      {/* <button type="submit" className={style.buttonOrderCreate}>
           Согласовать
          </button> */}
      {/* </form> */}
      <ProductOrder
        productTableData={getValues("order_products")}
        watch={watch}
        getValues={getValues}
        setValue={setValue}
      />
      <div className={style.noteAndButtons}>
        <textarea placeholder="Комментарий" className={style.note} value={note} onChange={(e)=>setnote(e.target.value)}/>
      <div className={style.buttonGroup}>

        <button className={style.buttonOrderApproval} onClick={() => agreedOrder(Number(orderid))}>Согласовать</button>
        <button
          className={`${style.buttonOrderApproval} ${style.buttonOrderApprovalReject}`}
          onClick={() => rejectOrder(Number(orderid))}
          >
          Отклонить
        </button>
          </div>
      </div>
    </div>
  );
}
