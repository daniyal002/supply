"use client";

import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import style from "./Order.module.scss";
import {
  useCreateOrderMutation,
  useDeleteOrderDocumentMutation,
  useGetOrderById,
  useOrderUserData,
  useUploadOrderDocumentMutation,
  useUpdateOrderMutation,
} from "@/hook/orderHook";
import { useForm } from "react-hook-form";
import {
  EnumOrderTypes,
  IDraftOrderItemRequest,
  IOrderItem,
  IOrderItemFormValues,
  IOrderItemRequest,
} from "@/interface/orderItem";
import HeaderOrder from "./HeaderOrder";
import SelectProductOrder from "./SelectProductOrder/SelectProductOrder";
import ProductOrder from "./ProductOrder/ProductOrder";
import { db } from "@/db/db";
import { useLiveQuery } from "dexie-react-hooks";
import { Button, message, Spin, Tabs, theme, Tooltip } from "antd";
import OrderStepHistory from "@/components/OrderStepHistory/OrderStepHistory";
import { TabsProps } from "antd/lib";
import RouteInfo from "@/components/RouteInfo/RouteInfo";
import { useProductData } from "@/hook/productHook";
import ModalSaveOrder from "@/components/UI/ModalSaveOrder/ModalSaveOrder";
import {
  useSaveDraftOrderMutation,
  useUpdateDraftOrderMutation,
} from "@/hook/orderTempHook";
import { useOrderIdStore } from "../../../../store/orderIdStore";
import { exportOrderToExcel } from "@/helper/ExportToExcel";
import {
  createOrderDocumentFormState,
  submitOrderDocuments,
} from "@/helper/orderDocumentSubmit";
import { CopyFilled, InfoCircleFilled } from "@ant-design/icons";
import ChatCore from "@/components/Chat/ChatCore";
import { useTabStore } from "../../../../store/tabStore";
import Can from "@/components/Can/Can";

interface Props {
  orderid?: string;
  type: "Добавить" | "Изменить";
  targetKey?: string;
  remove?: any;
}

export default function Order({ orderid, type, remove, targetKey }: Props) {
  const GetMeData = useLiveQuery(() => db.getMe.toCollection().first(), []);
  const { productData } = useProductData();

  const { orderUserData } = useOrderUserData();

  // Print
  const contentRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const handlePrint = useReactToPrint({
    contentRef,
    onBeforePrint: async () => await setIsPrinting(true),
    onAfterPrint: () => setIsPrinting(false),
  });

  const [toggle, setToggle] = useState<boolean>(false);
  const submitActionRef = useRef<"create" | "save" | null>(null);
  const [submitAction, setSubmitAction] = useState<"create" | "save" | null>(
    null,
  );
  const { isLoading } = useProductData();
  const { mutateAsync: createOrderMutationAsync, isPending: createOrderIsPending } =
    useCreateOrderMutation();
  const { mutateAsync: updateOrderMutationAsync, isPending: updateOrderIsPending } =
    useUpdateOrderMutation();
  const { mutateAsync: saveOrderMutationAsync, isPending: saveOrderIsPending } =
    useSaveDraftOrderMutation();
  const { mutateAsync: updateDraftOrderMutationAsync } = useUpdateDraftOrderMutation();
  const {
    mutateAsync: uploadOrderDocuments,
    isPending: uploadOrderDocumentsIsPending,
  } = useUploadOrderDocumentMutation();
  const {
    mutateAsync: deleteOrderDocument,
    isPending: deleteOrderDocumentIsPending,
  } = useDeleteOrderDocumentMutation();
  const {
    register,
    formState: { errors },
    reset,
    control,
    getValues,
    setValue,
    watch,
  } = useForm<IOrderItemFormValues>({ mode: "onChange" });
  let orderIdFromGetOrderById = orderid;
  if (orderid?.startsWith("copy")) {
    orderIdFromGetOrderById = orderid.replace("copy", "");
  }


   const isPurchase = GetMeData?.role?.permissions?.some(
    (p) => p.permission_code === "purchase_order_type_drop_down_list"
  );

  const copyLastOrderHeader = () => {
    if (orderUserData) {
      const lastOrder = orderUserData[0];
      if (lastOrder) {
        reset({
          employee_id: {
            value: lastOrder?.buyer?.buyer_id,
            label: lastOrder?.buyer?.buyer_name,
          },
          department_id: {
            value: lastOrder?.department?.department_id,
            label: lastOrder?.department?.department_name,
          },
          product_group: {
            value: lastOrder?.product_group?.product_group_id,
            label: lastOrder?.product_group?.product_group_name,
          },
          storage_id: {
            value: lastOrder?.storage?.storage_id,
            label: lastOrder?.storage?.storage_name,
          },
          oms: lastOrder?.oms,

          order_type: {
            value: lastOrder?.order_type,
            label:
              lastOrder?.order_type === "purchase"
                ? "Заявка на закупку"
                : "Заявка на склад",
          },
          ...createOrderDocumentFormState(lastOrder?.documents),
        });
      }
    }
  };

  const { getOrderByIdData } = useGetOrderById(
    orderIdFromGetOrderById as string
  );
  const [disabledOrder, setDisabledOrder] = useState<boolean>(false);

  useEffect(() => {
    if (orderid && getOrderByIdData) {
      if (
        (getOrderByIdData.current_step_container !== null ||
          (getOrderByIdData.current_step_container == null &&
            getOrderByIdData.in_route === false)) &&
        !orderid.startsWith("copy")
      ) {
        setDisabledOrder(true);
      } else {
        setDisabledOrder(false);
      }
    }
  }, [getOrderByIdData]);

  const orderId = useTabStore((state) => state.activeTabOrders);

  const items: TabsProps["items"] =
    orderid === "newOrder"
      ? [
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
                exportToExcel={() =>
                  exportOrderToExcel(
                    getOrderByIdData as IOrderItem,
                    productData || []
                  )
                }
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
        ]
      : [
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
                exportToExcel={() =>
                  exportOrderToExcel(
                    getOrderByIdData as IOrderItem,
                    productData || []
                  )
                }
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
          {
            key: "4",
            label: "Чат",
            children: (
              <ChatCore orderId={Number(orderId.replace("order-", ""))} />
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

  const [categoryMatches, setCategoryMatches] = useState<boolean>(false);

  useEffect(() => {
    const orderProducts = productsWatch;

    if (Array.isArray(orderProducts)) {
      const matches = orderProducts.some(
        (product) =>
          product.product?.product_group?.product_group_name !==
            productGroup.label && !product.order_product_link
      );
      setCategoryMatches(matches);
    }
  }, [productsWatch, productGroup]);

  const syncSubmittedDocuments = (
    documents: Array<string | { path?: string | null; file_name?: string | null; file_path?: string | null }>
  ) => {
    const nextDocumentState = createOrderDocumentFormState(documents);

    setValue("documents", nextDocumentState.documents, { shouldDirty: true });
    setValue("existingDocuments", nextDocumentState.existingDocuments, {
      shouldDirty: true,
    });
    setValue("removedDocuments", [], { shouldDirty: true });
    setValue("newDocuments", [], { shouldDirty: true });
  };

  const beginSubmitAction = (action: "create" | "save") => {
    if (submitActionRef.current) {
      return false;
    }

    submitActionRef.current = action;
    setSubmitAction(action);
    return true;
  };

  const finishSubmitAction = () => {
    submitActionRef.current = null;
    setSubmitAction(null);
  };

  const createOrder = async () => {
    if (!beginSubmitAction("create")) {
      return;
    }

    try {
      const data = getValues();
      if (data.order_products && data.order_products.length > 0) {
        const order: IOrderItemRequest = {
          category_matches: categoryMatches,
          department_id: data.department_id.value,
          order_type: isPurchase
            ? data?.order_type?.value
            : EnumOrderTypes.WAREHOUSE,
          employee_id: data.employee_id.value,
          storage_id: data.storage_id.value,
          oms: data.oms || false,
          order_status_id: 1,
          is_generic: data.is_generic,
          note: data.note,
          product_group_id: data.product_group.value,
          products: data.order_products.map((product) => {
            const productData = product.product || {};
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
              images: product.images,
              employee_ids: product.buyers?.map((buyer) => ({
                employee_id: buyer.buyer_id,
                product_quantity: buyer.product_quantity,
              })),
            };
          }),
          documents: [],
        };

        try {
          const { finalDocumentItems } = await submitOrderDocuments({
            existingDocuments: data.existingDocuments,
            removedDocuments: data.removedDocuments,
            newDocuments: data.newDocuments,
            uploadDocuments: uploadOrderDocuments,
            deleteDocument: deleteOrderDocument,
            submitRequest: async (documents) => {
              const payload = { ...order, documents };

              if (
                orderid !== "newOrder" &&
                orderid !== `copy${orderid?.split("copy")[1]}` &&
                getOrderByIdData
              ) {
                payload.order_id = Number(orderid);
                return updateOrderMutationAsync(payload);
              }

              return createOrderMutationAsync(payload);
            },
          });

          syncSubmittedDocuments(finalDocumentItems);
          remove(targetKey);
        } catch {}
      } else {
        message.warning("Добавьте товары в заявку !");
      }
    } finally {
      finishSubmitAction();
    }
  };

  const setDraftNewOrderId = useOrderIdStore(
    (state) => state.setDraftNewOrderId
  );
  const draftNewOrderId = useOrderIdStore((state) => state.draftNewOrderId);

  const saveOrder = async () => {
    if (!beginSubmitAction("save")) {
      return;
    }

    try {
      if (
        getValues().order_products &&
        getValues().order_products.length > 0 &&
        getValues().department_id &&
        getValues().employee_id &&
        getValues().storage_id &&
        getValues().product_group
      ) {
        const order: IDraftOrderItemRequest = {
          category_matches: categoryMatches,
          department_id: getValues().department_id.value,
          employee_id: getValues().employee_id.value,
          storage_id: getValues().storage_id.value,
          order_type: isPurchase
            ? getValues().order_type.value
            : EnumOrderTypes.WAREHOUSE,
          oms: getValues().oms || false,
          order_status_id: 8,
          is_generic: getValues().is_generic,
          note: getValues().note,
          product_group_id: getValues().product_group.value,
          products: getValues().order_products.map((product) => {
            const productData = product.product || {};
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
              images: product.images,
              employee_ids: product.buyers?.map((buyer) => ({
                employee_id: buyer.buyer_id,
                product_quantity: buyer.product_quantity,
              })),
            };
          }),
          documents: [],
        };

        try {
          const { response, finalDocumentItems } = await submitOrderDocuments({
            existingDocuments: getValues().existingDocuments,
            removedDocuments: getValues().removedDocuments,
            newDocuments: getValues().newDocuments,
            uploadDocuments: uploadOrderDocuments,
            deleteDocument: deleteOrderDocument,
            submitRequest: async (documents) => {
              const payload = { ...order, documents };

              if (draftNewOrderId && draftNewOrderId !== "0") {
                return updateDraftOrderMutationAsync({
                  ...payload,
                  order_temp_id: Number(draftNewOrderId),
                });
              }

              return saveOrderMutationAsync(payload);
            },
          });

          syncSubmittedDocuments(finalDocumentItems);

          if (response.order.order_temp_id) {
            setDraftNewOrderId(response.order.order_temp_id.toString());
          }
        } catch {}
      } else {
        message.warning("Заполните шапку и товары!");
      }
    } finally {
      finishSubmitAction();
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
        storage_id: undefined,
        order_type: undefined,
        is_generic: false,
        ...createOrderDocumentFormState(),
      });
    } else if (
      orderid !== "newOrder"
      // orderid !== `copy${orderid?.split("copy")[1]}`
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
        is_generic: getOrderByIdData?.is_generic,
        ...createOrderDocumentFormState(getOrderByIdData?.documents),
      });
    }
  }, [reset, type, orderid, getOrderByIdData]);

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

  const {
    token: { colorText },
  } = theme.useToken();

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
        <div className={style.newOrderCopy}>
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "row-reverse",
                gap: "10px",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              {!toggle ? (
                <>
                  <h1 style={{ color: colorText }}>
                    {orderid === "newOrder"
                      ? "Новая заявка"
                      : orderid ===
                        `copy${Number(orderid?.split("copy").join(""))}`
                      ? "Копия"
                      : `Заявка №-${getOrderByIdData?.order_number.replace(
                          /^0+/,
                          ""
                        )}`}
                  </h1>
                </>
              ) : (
                <h1 style={{ color: colorText }}>Выбор товара</h1>
              )}
              {categoryMatches && (
                <Tooltip
                  title={
                    "В заявке есть товары с разными категориями, заявка будет сначала отправлена на согласование по категориям, если товары окажутся с разными категориями, то товары будут отклонены автоматически"
                  }
                >
                  <InfoCircleFilled
                    style={{ fontSize: "20px", color: "rgb(131, 124, 230)" }}
                    className={style.pulseAnimation}
                  />
                </Tooltip>
              )}
            </div>
            {orderid !== `copy${Number(orderid?.split("copy").join(""))}` &&
              orderid !== "newOrder" && (
                <p style={{ fontSize: "14px", fontStyle: "italic" }}>
                  статус заявки:{" "}
                  <span
                    style={{
                      color: getOrderByIdData?.order_status.status_color,
                      textTransform: "uppercase",
                      fontWeight: "bold",
                    }}
                  >
                    {getOrderByIdData?.order_status.status_name}
                  </span>
                </p>
              )}
          </div>
          {orderUserData &&
            orderUserData.length > 0 &&
            orderid === "newOrder" && (
              <div>
                <Tooltip title={"Скопировать шапку из последней заявки"}>
                  <Button onClick={copyLastOrderHeader}>
                    <CopyFilled style={{ fontSize: "20px" }} />
                  </Button>
                </Tooltip>
              </div>
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
            toggle={toggle}
            setToggle={setToggle}
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
            disabledOrder={disabledOrder}
          />

          {/* </form> */}
          {!isPrinting && !getOrderByIdData?.is_archive && (
            <button
              onClick={() => {
                if (disabledOrder) {
                  message.info(
                    "Заявка в маршруте! Сбросьте заявку если хотите изменить."
                  );
                } else if (!getValues("product_group.value")) {
                  message.warning("Выберите категорию товара");
                } else {
                  setToggle(!toggle);
                }
              }}
              disabled={orderid !== "newOrder" && getOrderByIdData?.is_archive}
              className={`${style.toggleBtn} ${toggle ? style.active : ""}`}
            >
              Подбор товара
            </button>
          )}

          <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
          <Can permission="add_order">
            <div className={style.footerButtonGroup}>
              {!disabledOrder && !isPrinting && (
                <button
                  type="button"
                  onClick={() => void createOrder()}
                  className={style.buttonOrderCreate}
                  disabled={
                    submitAction !== null ||
                    createOrderIsPending ||
                    updateOrderIsPending ||
                    uploadOrderDocumentsIsPending ||
                    deleteOrderDocumentIsPending
                  }
                >
                  {orderid === "newOrder" ||
                  orderid === `copy${Number(orderid?.split("copy").join(""))}`
                    ? createOrderIsPending || submitAction === "create"
                      ? "Создается..."
                      : "Создать"
                    : updateOrderIsPending || submitAction === "create"
                    ? "Перезапускается..."
                    : "Перезапуск"}
                </button>
              )}

              {!disabledOrder && orderid === "newOrder" && !isPrinting && (
                <button
                  type="button"
                  className={style.buttonOrderSave}
                  onClick={() => void saveOrder()}
                  disabled={
                    submitAction !== null ||
                    saveOrderIsPending ||
                    uploadOrderDocumentsIsPending ||
                    deleteOrderDocumentIsPending
                  }
                >
                  {saveOrderIsPending || submitAction === "save"
                    ? "Сохраняется..."
                    : "Сохранить"}
                </button>
              )}
            </div>
          </Can>
        </div>
      </div>
    </div>
  );
}
