"use client";

import React, { useEffect, useState } from "react";
import style from "./Order.module.scss";
import {
  useCreateOrderMutation,
  useGetOrderById,
  useUpdateOrderMutation,
} from "@/hook/orderHook";
import { SubmitHandler, useForm } from "react-hook-form";
import { IOrderItemFormValues, IOrderItemRequest } from "@/interface/orderItem";
import HeaderOrder from "./HeaderOrder";
import SelectProductOrder from "./SelectProductOrder/SelectProductOrder";
import ProductOrder from "./ProductOrder/ProductOrder";
import { db } from "@/db/db";
import { useLiveQuery } from "dexie-react-hooks";
import { message, Spin, Tabs } from "antd";
import OrderStepHistory from "@/components/OrderStepHistory/OrderStepHistory";
import { TabsProps } from "antd/lib";
import RouteInfo from "@/components/RouteInfo/RouteInfo";
import {
  LeftSquareFilled,
} from "@ant-design/icons";
import { useProductData } from "@/hook/productHook";

interface Props {
  orderid?: string;
  type: "Добавить" | "Изменить";
  targetKey?: string;
  remove?: any;
}

export default function AdminOrder({ orderid, type, remove, targetKey }: Props) {
  const [toggle, setToggle] = useState<boolean>(false);
  const {isLoading} = useProductData()
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
  const [disabledOrder, setDisabledOrder] = useState<boolean>(false);

  useEffect(() => {
    if (orderid && getOrderByIdData) {
      if (
        getOrderByIdData.current_step_container !== null ||
        (getOrderByIdData.current_step_container == null &&
          getOrderByIdData.in_route === false)
      ) {
        setDisabledOrder(true);
      } else {
        setDisabledOrder(false);
      }
    }
  }, [getOrderByIdData]);

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
          disabledOrder={disabledOrder}
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

  const onChange = (key: string) => {};

  const GetMeData = useLiveQuery(() => db.getMe.toCollection().first(), []);

  const productsWatch = watch("order_products");

  useEffect(() => {
    resetField("department_id", { defaultValue: undefined });

    const buyerType = GetMeData?.employee?.parlors
      ?.filter((parlor) =>
        parlor.employees.some(
          (employee) => employee.buyer_id === getValues("employee_id.value")
        )
      )
      ?.flatMap((parlor) => parlor.employees)
      .find(
        (employee) => employee.buyer_id === getValues("employee_id.value")
      )?.buyer_type;

    if (buyerType === "employee") {
      setValue(
        "order_products",
        getValues("order_products")?.map((product) => ({
          ...product,
          buyers: [],
        })) || []
      );
    }
  }, [getValues("employee_id")]);

  const onSubmit: SubmitHandler<IOrderItemFormValues> = (data) => {
    if (data.order_products && data.order_products.length > 0) {
      const order: IOrderItemRequest = {
        department_id: data.department_id.value,
        employee_id: data.employee_id.value,
        oms: data.oms || false,
        // order_route_id: 4,
        order_status_id: 1,
        note: data.note,
        product_group_id: data.product_group.value,
        products: data.order_products.map((product) => {
          const productData = product.product || {}; // Если product не существует, используем пустой объект
          const hasOrderProductName = !!product.order_product_name;
          const hasProductId = !!productData.product_id;
          return {
            product_id: hasOrderProductName
              ? NaN
              : hasProductId
              ? productData.product_id
              : NaN,
            order_product_name: hasProductId
              ? ""
              : hasOrderProductName
              ? product.order_product_name
              : "",
            order_product_link: hasProductId
              ? ""
              : hasOrderProductName
              ? product.order_product_link
              : "",
            product_quantity: product.product_quantity,
            // unit_measurement_id: product.unit_measurement.unit_measurement
            //   .unit_measurement_id as number,
            unit_measurement_id: 8,
            note: product.note,
            employee_ids: product.buyers?.map((buyer) => buyer.buyer_id),
          };
        }),
      };
      if (
        orderid !== "newOrder" &&
        orderid !== `draft${orderid?.split("draft")[1]}` &&
        getOrderByIdData
      ) {
        order.order_id = Number(orderid);
        updateOrderMutation(order, {
          onSuccess() {
            remove(targetKey);
          },
        });
      } else {
        createOrderMutation(order, {
          onSuccess() {
            remove(targetKey);
          },
        });
      }
    } else {
      message.warning("Добавьте товары в заявку !");
    }
  };

  useEffect(() => {
    if (orderid === undefined) {
      reset({
        employee_id: undefined,
        department_id: undefined,
        oms: false,
        order_products: undefined,
        product_group: undefined,
      });
    } else if (
      orderid !== "newOrder" &&
      orderid !== `draft${orderid?.split("draft")[1]}`
    ) {
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
    }
  }, [reset, type, orderid, getOrderByIdData]);

  return (
    <div className={style.order}>
    {isLoading && <Spin fullscreen={true} className={style.spin} size="large"/> }
    <div className={style.newOrder}>
      {!toggle ? (
        <h1>
          {orderid === "newOrder"
            ? "Новая заявка"
            : orderid === `draft${Number(orderid?.split("draft").join(""))}`
            ? "Черновик"
            : `Заявка №-${getOrderByIdData?.order_number}`}
        </h1>
      ) : (
        <h1>Выбор товара</h1>
      )}

      <div
        className={
          toggle
            ? `${style.active} ${style.selectProductOrder}`
            : style.selectProductOrder
        }
      >
        {toggle && (
          <LeftSquareFilled
            title="Назад"
            onClick={() => setToggle(!toggle)}
            className={style.toggleBackButton}
          />
        )}

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
            disabledOrder={disabledOrder}
          />
          {!disabledOrder && (
            <button type="submit" className={style.buttonOrderCreate}>
              {orderid === "newOrder" ||
              orderid === `draft${Number(orderid?.split("draft").join(""))}`
                ? "Создать"
                : "Перезапуск"}
            </button>
          )}
        </form>
        {!disabledOrder && getValues("product_group.value") && !toggle && (
          <button
            onClick={() => setToggle(!toggle)}
            className={`${style.toggleBtn} ${toggle ? style.active : ""}`}
          >
            Подбор товара
          </button>
        )}

        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </div>
    </div>
    </div>
  );
}
