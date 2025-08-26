"use client";

import React, { useEffect, useRef, useState } from "react";
import style from "./DraftOrder.module.scss";
import { useCreateOrderMutation } from "@/hook/orderHook";
import { useForm } from "react-hook-form";
import {
  EnumOrderTypes,
  IDraftOrderItemRequest,
  IOrderDraftItemFormValues,
} from "@/interface/orderItem";
import HeaderOrder from "./DraftHeaderOrder";
import SelectProductOrder from "./SelectProductOrder/SelectProductOrder";
import ProductOrder from "./ProductOrder/ProductOrder";
import { db } from "@/db/db";
import { useLiveQuery } from "dexie-react-hooks";
import { message, Spin, Tabs, Tooltip } from "antd";
import { TabsProps } from "antd/lib";
import { useProductData } from "@/hook/productHook";
import ModalSaveOrder from "@/components/UI/ModalSaveOrder/ModalSaveOrder";
import {
  useDeleteDraftOrderByIdMutation,
  useGetOrderDraftById,
  useSaveDraftOrderMutation,
  useUpdateDraftOrderMutation,
} from "@/hook/orderTempHook";
import { useReactToPrint } from "react-to-print";
import { InfoCircleFilled } from "@ant-design/icons";

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
  const GetMeData = useLiveQuery(() => db.getMe.toCollection().first(), []);

  // Print
    const contentRef = useRef<HTMLDivElement>(null);
    const [isPrinting, setIsPrinting] = useState(false);
    const handlePrint = useReactToPrint({
      contentRef,
      onBeforePrint: async () => await setIsPrinting(true),
      onAfterPrint: () => setIsPrinting(false),
    });

  const [toggle, setToggle] = useState<boolean>(false);
  const { isLoading } = useProductData();
  const { mutate: createOrderMutation } = useCreateOrderMutation();

  const { isPending: saveOrderIsPending } = useSaveDraftOrderMutation();
  const { mutate: updateDraftOrderMutation } = useUpdateDraftOrderMutation();
  const {
    register,
    formState: { errors },
    reset,
    control,
    getValues,
    setValue,
    watch,
  } = useForm<IOrderDraftItemFormValues>({ mode: "onChange" });
  let orderIdFromGetOrderById = draftOrderid;
  if (draftOrderid?.startsWith("copy")) {
    orderIdFromGetOrderById = draftOrderid.replace("copy", "");
  }
  const { getOrderByIdData } = useGetOrderDraftById(
    orderIdFromGetOrderById as string
  );

  const {
    mutate: deleteDraftOrderByIdMutation,
    isPending: DeleteDraftOrderByIisPending,
  } = useDeleteDraftOrderByIdMutation();

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
          role={GetMeData?.role?.role_name as string}
          handlePrint={handlePrint}
          isPrinting={isPrinting}
        />
      ),
    },
  ];

  const onChange = (key: string) => {};

  const productsWatch = watch("order_products");
  const productGroup = watch("product_group");

  useEffect(() => {
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

  const [categoryMatches,setCategoryMatches] = useState<boolean>(false)

    useEffect(() => {
      const orderProducts = productsWatch;

      if (Array.isArray(orderProducts)) {
        const matches = orderProducts.some(product =>
          product.product?.product_group?.product_group_name !== productGroup.label && !product.order_product_link
        );
        setCategoryMatches(matches);
      }

    }, [productsWatch,  productGroup]);

  const createOrder = () => {
    const data = getValues();
    if (data.order_products && data.order_products.length > 0) {
      const order: IDraftOrderItemRequest = {
        category_matches:categoryMatches,
        department_id: data.department_id.value,
        employee_id: data.employee_id.value,
        order_type:
          GetMeData?.role?.role_name === "user_purchase" ||
          GetMeData?.role?.role_name === "admin"
            ? data.order_type.value
            : EnumOrderTypes.WAREHOUSE,
        storage_id: data.storage_id.value,
        oms: data.oms || false,
        order_status_id: 1,
        is_generic: data.is_generic,
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
            order_product_name: product?.order_product_name,
            order_product_link: product?.order_product_link,
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
            deleteDraftOrderByIdMutation({
              order_temp_id: Number(draftOrderid),
            });
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
        category_matches:categoryMatches,
        department_id: getValues().department_id.value,
        employee_id: getValues().employee_id.value,
        storage_id: getValues().storage_id.value,
        oms: getValues().oms || false,
        order_type:
          GetMeData?.role?.role_name === "user_purchase" ||
          GetMeData?.role?.role_name === "admin"
            ? getValues().order_type.value
            : EnumOrderTypes.WAREHOUSE,
        order_status_id: 8,
        is_generic: getValues().is_generic,
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
            order_product_name: product?.order_product_name,
            order_product_link: product?.order_product_link,
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
        order_type: undefined,
        is_generic:false
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
        is_generic: getOrderByIdData?.is_generic
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
    <div className={style.order} ref={contentRef}>
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
        <div style={{display:"flex",flexDirection:'row-reverse', gap:"10px", alignItems:"center",justifyContent:"flex-end"}}>
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
         {categoryMatches && (
          <Tooltip title={ "В заявке есть товары с разными категориями, заявка будет сначала отправлена на согласование по категориям, если товары окажутся с разными категориями, то товары будут отклонены автоматически"}>
        <InfoCircleFilled style={{fontSize:"20px", color:"red"}} className={style.pulseAnimation} />
        </Tooltip>
        )}
        </div>

        <div
          className={
            toggle
              ? `${style.active} ${style.selectProductOrder}`
              : style.selectProductOrder
          }
        >
          <SelectProductOrder
            watch={watch}
            getValues={getValues}
            setValue={setValue}
            setToggle={setToggle}
            toggle={toggle}
          />
        </div>

        <div
          className={
            !toggle
              ? `${style.active} ${style.productOrder}`
              : style.productOrder
          }
        >
          {/* <form key={1} onSubmit={handleSubmit(onSubmit)}> */}
          <HeaderOrder
            control={control}
            register={register}
            getValues={getValues}
            setValue={setValue}
            watch={watch}
            errors={errors}
            disabledOrder={false}
          />

          {/* </form> */}
          {!isPrinting && (

          <button
            onClick={() => {
              if (!getValues("product_group.value")) {
                message.warning("Выберите категорию товара");
              } else {
                setToggle(!toggle);
              }
            }}
            className={`${style.toggleBtn} ${toggle ? style.active : ""}`}
          >
            Подбор товара
          </button>
          )}

          <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
          <div className={style.footerButtonGroup}>
            {!isPrinting && (
              <>
              <button
              type="button"
              onClick={() => createOrder()}
              className={style.buttonOrderCreate}
            >
              {DeleteDraftOrderByIisPending ? "Создается..." : "Создать"}
            </button>

            <button
              type="button"
              className={style.buttonOrderSave}
              onClick={() => saveOrder()}
            >
              {saveOrderIsPending ? "Сохраняется..." : "Сохранить"}
            </button>
            </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
