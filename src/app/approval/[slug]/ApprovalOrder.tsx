"use client";

import React, { useEffect, useRef, useState } from "react";
import style from "./Order.module.scss";
import {
  useAgreedOrderMutation,
  useGetOrderById,
  useRejectOrderMutation,
} from "@/hook/orderHook";
import { SubmitHandler, useForm } from "react-hook-form";
import { IOrderItem, IOrderItemFormValues } from "@/interface/orderItem";
import ProductOrder from "./ProductOrder/ProductOrder";
import ApprovalHeaderOrder from "./ApprovalHeaderOrder";
import OrderStepHistory from "@/components/OrderStepHistory/OrderStepHistory";
import { Input, message, Spin, Tabs, TabsProps } from "antd";
import RouteInfo from "@/components/RouteInfo/RouteInfo";
import { useNotificationStore } from "../../../../store/notificationStore";
import { useMarkAsReadNotification } from "@/hook/notificationHook";
import { exportOrderToExcel } from "@/helper/ExportToExcel";
import { useReactToPrint } from "react-to-print";
import { useProductData } from "@/hook/productHook";

interface Props {
  orderid?: string;
  type: "Добавить" | "Изменить";
  targetKey?: string;
  remove?: any;
  readonly?: boolean;
}

export default function ApprovalOrder({
  orderid,
  type,
  remove,
  targetKey,
  readonly = false,
}: Props) {
  const { TextArea } = Input;
    const {productData} = useProductData()


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
  const notifications = useNotificationStore((state) => state.notifications);
  const { mutate: markAsReadNotification } = useMarkAsReadNotification();

   // Print
    const contentRef = useRef<HTMLDivElement>(null);
    const [isPrinting, setIsPrinting] = useState<boolean>(false);
    const handlePrint = useReactToPrint({
      contentRef,
      onBeforePrint: async () => await setIsPrinting(true),
      onAfterPrint: () => setIsPrinting(false),
    });

  useEffect(() => {
    const currentNotifications = notifications.filter(
      (notification) => notification.data_id === Number(orderid)
    );
    if (currentNotifications)
      currentNotifications.forEach((notification) => {
        markAsReadNotification(notification?.notification_id);
      });
  }, []);

  const { getOrderByIdData } = useGetOrderById(orderid as string);
  const {
    mutate: agreedOrderMutation,
    isPending: agreedOrderPending,
    isSuccess: agreedOrderSuccess,
  } = useAgreedOrderMutation();
  const {
    mutate: rejectOrderMutation,
    isPending: rejectOrderPending,
    isSuccess: rejectOrderSuccess,
  } = useRejectOrderMutation();
  const [note, setnote] = React.useState("");
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Выбранные товары",
      children: (
        <ProductOrder
          productTableData={getValues("order_products")}
          getValues={getValues}
          setValue={setValue}
          watch={watch}
          readonly={readonly}
          exportToExcel={() => exportOrderToExcel(getOrderByIdData as IOrderItem, productData || [])}
          handlePrint={handlePrint}
          isPrinting={isPrinting}
        />
      ),
    },
    {
      key: "2",
      label: "История согласования",
      children: <OrderStepHistory order_id={Number(orderid)} />,
    },
    {
      key: "3",
      label: "Маршрут",
      children: <RouteInfo order_id={Number(orderid)} />,
    },
  ];

  const agreedOrder = (order_id: number) => {
    agreedOrderMutation(
      { order_id, note },
      {
        onSuccess() {
          remove(targetKey);
        },
      }
    );
  };

  const rejectOrder = (order_id: number) => {
    if (note === "") {
      message.warning("Введите комментарий");
    } else if (note.length < 5) {
      message.warning("Введите корректный комментарий");
    } else {
      rejectOrderMutation(
        { order_id, note },
        {
          onSuccess() {
            remove(targetKey);
          },
        }
      );
    }
  };

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
      order_status_id: getOrderByIdData?.order_status?.status_id,
      note: getOrderByIdData?.note,
      order_products: getOrderByIdData?.order_products,
      order_type: {
        value: getOrderByIdData?.order_type,
        label:
          getOrderByIdData?.order_type === "purchase"
            ? "Заявка на закупку"
            : "Заявка на склад",
      },
      order_author_name: getOrderByIdData?.order_author_name,
    });
  }, [reset, type, orderid, getOrderByIdData]);

  const onSubmit: SubmitHandler<IOrderItemFormValues> = (data) => {
    // console.log(data);
  };

  return (
    <div ref={contentRef}>
      {(agreedOrderPending || rejectOrderPending) && <Spin fullscreen={true} />}
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
        <Tabs defaultActiveKey="1" items={items} />
        {!readonly && !isPrinting &&  (
          <div className={style.commentAndButtons}>
            <TextArea
              placeholder="Комментарий"
              className={style.comment}
              value={note}
              onChange={(e) => setnote(e.target.value)}
            />
            <div className={style.buttonGroup}>
              <button
                className={style.buttonOrderApproval}
                onClick={() => agreedOrder(Number(orderid))}
              >
                Согласовать
              </button>
              <button
                className={`${style.buttonOrderApproval} ${style.buttonOrderApprovalReject}`}
                onClick={() => rejectOrder(Number(orderid))}
              >
                Отклонить
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
