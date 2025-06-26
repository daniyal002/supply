"use client";

import React, { useEffect, useRef, useState } from "react";
import style from "./DraftOrder.module.scss";
import {
  useCreateOrderMutation,
  useUpdateOrderMutation,
} from "@/hook/orderHook";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  EnumOrderTypes,
  IDraftOrderItemRequest,
  IOrderDraftItemFormValues,
  IOrderItemFormValues,
  IOrderItemRequest,
} from "@/interface/orderItem";
import HeaderOrder from "./DraftHeaderOrder";
import SelectProductOrder from "./SelectProductOrder/SelectProductOrder";
import ProductOrder from "./ProductOrder/ProductOrder";
import { db } from "@/db/db";
import { useLiveQuery } from "dexie-react-hooks";
import { Button, FloatButton, message, Spin, Tabs } from "antd";
import { TabsProps } from "antd/lib";
import { useProductData } from "@/hook/productHook";
import { MoveLeft } from "lucide-react";
import ModalSaveOrder from "./ModalSaveOrder/ModalSaveOrder";
import {
  useDeleteDraftOrderByIdMutation,
  useGetOrderDraftById,
  useSaveDraftOrderMutation,
  useUpdateDraftOrderMutation,
} from "@/hook/orderTempHook";
import { ArrowLeftOutlined } from "@ant-design/icons";

interface Props {
  draftOrderid?: string;
  type: "Добавить" | "Изменить";
  targetKey?: string;
  remove?: any;
}

export default function DraftOrder({
  draftOrderid,
  type,
  remove,
  targetKey,
}: Props) {
  const [toggle, setToggle] = useState<boolean>(false);
  const { isLoading } = useProductData();
  const { mutate: createOrderMutation } =
    useCreateOrderMutation();

  const { isPending: saveOrderIsPending } =
    useSaveDraftOrderMutation();
  const {
    mutate: updateDraftOrderMutation,
  } = useUpdateDraftOrderMutation();
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
  } = useForm<IOrderDraftItemFormValues>({ mode: "onChange" });
  let orderIdFromGetOrderById = draftOrderid;
  if (draftOrderid?.startsWith("copy")) {
    orderIdFromGetOrderById = draftOrderid.replace("copy", "");
  }
  const { getOrderByIdData } = useGetOrderDraftById(
    orderIdFromGetOrderById as string
  );

  const {mutate:deleteDraftOrderByIdMutation,isPending:DeleteDraftOrderByIisPending} = useDeleteDraftOrderByIdMutation()

  const [orderType, setOrderType] = useState<
      "purchase" | "warehouse" | undefined
    >(undefined);

    useEffect(() => {
      const products = getValues("order_products");

      if (Array.isArray(products)) {
        const hasPurchase = products.some(
          (product) => product.order_product_link
        );
        const hasWarehouseOnly = products.every(
          (product) => !product.order_product_link
        );

        if (hasPurchase) {
          setOrderType("purchase");
        } else if (hasWarehouseOnly && products.length > 0) {
          setOrderType("warehouse");
        } else {
          setOrderType(undefined);
        }
      } else {
        setOrderType(undefined);
      }
    }, [getValues("order_products")]);

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
          disabledOrder={false}
          orderType={orderType}
        />
      ),
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
      const order: IDraftOrderItemRequest = {
        department_id: data.department_id.value,
        employee_id: data.employee_id.value,
        order_type:EnumOrderTypes.WAREHOUSE,
        storage_id: data.storage_id.value,
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
            unit_measurement_id: product.unit_measurement.unit_measurement
              .unit_measurement_id as number,
            note: product.note,
            employee_ids: product.buyers?.map((buyer) => buyer.buyer_id),
          };
        }),
      };
      if (
        draftOrderid !== "newOrder" &&
        draftOrderid !== `copy${draftOrderid?.split("copy")[1]}` &&
        getOrderByIdData
      ) {
        createOrderMutation(order, {
          onSuccess() {
            deleteDraftOrderByIdMutation({order_temp_id:Number(draftOrderid)})
            remove(targetKey);
          },
        });
      }
    } else {
      message.warning("Добавьте товары в заявку !");
    }
  };

  const saveOrder = () => {
    if (
      getValues().order_products &&
      getValues().order_products.length > 0 &&
      getValues().department_id &&
      getValues().employee_id &&
      getValues().storage_id &&
      getValues().product_group
    ) {
      const order: IDraftOrderItemRequest = {
        department_id: getValues().department_id.value,
        employee_id: getValues().employee_id.value,
        storage_id: getValues().storage_id.value,
        oms: getValues().oms || false,
        order_type:EnumOrderTypes.WAREHOUSE,
        order_status_id: 8,
        note: getValues().note,
        product_group_id: getValues().product_group.value,
        products: getValues().order_products.map((product) => {
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
            unit_measurement_id: 8,
            note: product.note,
            employee_ids: product.buyers?.map((buyer) => buyer.buyer_id),
          };
        }),
      };

      updateDraftOrderMutation({
        ...order,
        order_temp_id: Number(draftOrderid),
      });
    } else {
      message.warning("Заполните шапку и товары!");
    }
  };

  useEffect(() => {
    if (draftOrderid === undefined) {
      reset({
        employee_id: undefined,
        department_id: undefined,
        oms: false,
        order_products: undefined,
        product_group: undefined,
        storage_id: undefined,
        order_type:undefined,
      });
    } else if (
      draftOrderid !== "newOrder"
      // orderid !== `copy${orderid?.split("copy")[1]}`
    ) {
      reset({
        order_temp_id: getOrderByIdData?.order_temp_id,
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
        storage_id: {
          value: getOrderByIdData?.storage?.storage_id,
          label: getOrderByIdData?.storage?.storage_name,
        },
        oms: getOrderByIdData?.oms,
        order_route_id: 1,
        order_status_id: getOrderByIdData?.order_status?.order_status_id,
        note: getOrderByIdData?.note,
        order_products: getOrderByIdData?.order_products,
        order_type:{
          value:getOrderByIdData?.order_type,
          label: getOrderByIdData?.order_type === "purchase" ? "Заявка на закупку" : "Заявка на склад"
        }
    });
    }
  }, [reset, type, draftOrderid, getOrderByIdData]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Если toggle === true — сбрасываем таймер
    if (toggle && timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      return;
    }

    // Устанавливаем новый таймер, если модальное окно закрыто и toggle false
    if (!isModalOpen && !toggle && getValues("order_products")?.length > 0) {
      timeoutRef.current = setTimeout(() => {
        setIsModalOpen(true);
      }, 900000);
    }

    // Очистка при размонтировании или повторном вызове эффекта
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isModalOpen, toggle]);

  return (
    <div className={style.order}>
      <ModalSaveOrder
        setIsModalOpen={setIsModalOpen}
        isModalOpen={isModalOpen}
        getValues={getValues}
        saveOrder={saveOrder}
      />
      {isLoading && (
        <Spin fullscreen={true} className={style.spin} size="large" />
      )}
      <div className={style.newOrder}>
        {!toggle ? (
          <h1>
            {draftOrderid === "newOrder"
              ? "Новая заявка"
              : draftOrderid ===
                `copy${Number(draftOrderid?.split("copy").join(""))}`
              ? "Копия"
              : `Черновик №-${getOrderByIdData?.order_temp_id
                  ?.toString()
                  .replace(/^0+/, "")}`}
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
            <Button
            type="primary"
            ghost
            icon={<ArrowLeftOutlined />}
            onClick={() => setToggle(!toggle)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "start",
              marginTop: 10,
              marginBottom: 10,
              fontWeight: 500,
              width:"100px"
            }}
          >
            Назад
          </Button>
          )}

          <SelectProductOrder
            watch={watch}
            getValues={getValues}
            setValue={setValue}
          />
        </div>

        <div
          className={
            !toggle
              ? `${style.active} ${style.productOrder}`
              : style.productOrder
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
              disabledOrder={false}
            />

            <div className={style.footerButtonGroup}>
                <button type="submit" className={style.buttonOrderCreate}>
                  {DeleteDraftOrderByIisPending ? "Создается..." : "Создать"}
                </button>

                <button
                  type="button"
                  className={style.buttonOrderSave}
                  onClick={() => saveOrder()}
                >
                  {saveOrderIsPending
                      ? "Сохраняется..."
                      : "Сохранить"
                    }
                </button>
            </div>
          </form>
          <button
            onClick={() => {
              if (!getValues("product_group.value")) {
                message.warning("Выберите категорию товара");
              } else {
                if (orderType === "purchase") {
                  message.warning(
                    "Вы не можете выбрать товары, пока есть новые товары"
                  );
                } else {
                  setToggle(!toggle);
                }
              }
            }}
            className={`${style.toggleBtn} ${toggle ? style.active : ""}`}
          >
            Подбор товара
          </button>

          <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        </div>
      </div>
    </div>
  );
}
