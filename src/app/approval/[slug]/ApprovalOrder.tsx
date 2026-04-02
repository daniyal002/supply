"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import style from "./Order.module.scss";
import {
  useAgreedOrderMutation,
  useDeleteOrderDocumentMutation,
  useGetOrderById,
  useRejectOrderMutation,
  useUpdateOrderPartialMutation,
  useUploadOrderDocumentMutation,
} from "@/hook/orderHook";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  EnumOrderTypes,
  IOrderItem,
  IOrderItemFormValues,
  IOrderItemRequest,
} from "@/interface/orderItem";
import ProductOrder from "./ProductOrder/ProductOrder";
import ApprovalHeaderOrder from "./ApprovalHeaderOrder";
import OrderStepHistory from "@/components/OrderStepHistory/OrderStepHistory";
import { Input, message, Spin, Tabs, TabsProps } from "antd";
import RouteInfo from "@/components/RouteInfo/RouteInfo";
import { useNotificationStore } from "../../../../store/notificationStore";
import { useMarkAsReadNotification } from "@/hook/notificationHook";
import { exportOrderToExcel } from "@/helper/ExportToExcel";
import { useReactToPrint } from "react-to-print";
import {
  useProductData,
  useUpdateOrderProductEmployeesMutation,
} from "@/hook/productHook";
import { useEmployeeData } from "@/hook/employeeHook";
import ChatCore from "@/components/Chat/ChatCore";
import { useTabStore } from "../../../../store/tabStore";
import { IProductTable } from "@/interface/productTable";
import { db } from "@/db/db";
import { useLiveQuery } from "dexie-react-hooks";
import {
  createOrderDocumentFormState,
  submitOrderDocuments,
} from "@/helper/orderDocumentSubmit";
import SelectProductOrder from "./SelectProductOrder/SelectProductOrder";

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
  const { productData } = useProductData();
  const { employeeData } = useEmployeeData();
  const getMeData = useLiveQuery(() => db.getMe.toCollection().first(), []);
  const [toggle, setToggle] = useState<boolean>(false);

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
  const { mutate: markAsReadNotification } = useMarkAsReadNotification("info");

  // Print
  const contentRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const handlePrint = useReactToPrint({
    contentRef,
    onBeforePrint: async () => setIsPrinting(true),
    onAfterPrint: () => setIsPrinting(false),
  });

  useEffect(() => {
    const currentNotifications = notifications.filter(
      (notification) => notification.data_id === Number(orderid),
    );
    if (currentNotifications)
      currentNotifications.forEach((notification) => {
        markAsReadNotification(notification?.notification_id);
      });
  }, []);

  const { getOrderByIdData } = useGetOrderById(orderid as string);
  const {
    mutateAsync: agreedOrderMutationAsync,
    isPending: agreedOrderPending,
    isSuccess: agreedOrderSuccess,
  } = useAgreedOrderMutation();
  const {
    mutateAsync: rejectOrderMutationAsync,
    isPending: rejectOrderPending,
    isSuccess: rejectOrderSuccess,
  } = useRejectOrderMutation();
  const {
    mutateAsync: updateOrderProductEmployeesMutationAsync,
    isPending: updateOrderProductEmployeesPending,
  } = useUpdateOrderProductEmployeesMutation();

  const {
    mutateAsync: uploadOrderDocuments,
    isPending: uploadOrderDocumentsIsPending,
  } = useUploadOrderDocumentMutation();
  const {
    mutateAsync: deleteOrderDocument,
    isPending: deleteOrderDocumentIsPending,
  } = useDeleteOrderDocumentMutation();

  const {
    mutateAsync: updateOrderMutationAsync,
    isPending: updateOrderMutationIsPending,
  } = useUpdateOrderPartialMutation();

  const [note, setnote] = React.useState("");
  const selectedEmployeeId = watch("employee_id")?.value;
  const isSelectedEmployeeTypeEmployee =
    employeeData?.find((employee) => employee.buyer_id === selectedEmployeeId)
      ?.buyer_type === "employee";
  const hasUpdateOrderProductEmployeesPermission =
    getMeData?.role?.permissions?.some(
      (permission) =>
        permission.permission_code === "update_order_product_employees",
    ) ?? false;

  const orderId = useTabStore((state) => state.activeTabApproval);
  const [activeTabKey, setActiveTabKey] = useState<number>();

   const hasDeleteOrderProductPermission = useMemo(
      () =>
        (getMeData?.role?.permissions || []).some(
          (permission) => permission.permission_code === "update_order_in_route",
        ),
      [getMeData],
    );

  const items: TabsProps["items"] = readonly
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
              readonly={readonly}
              exportToExcel={() =>
                exportOrderToExcel(
                  getOrderByIdData as IOrderItem,
                  productData || [],
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
              readonly={readonly}
              exportToExcel={() =>
                exportOrderToExcel(
                  getOrderByIdData as IOrderItem,
                  productData || [],
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

  const validateAndUpdateOrderProductEmployees = async () => {
    if (!hasUpdateOrderProductEmployeesPermission) {
      return true;
    }

    const orderProducts = getValues("order_products") || [];
    const productsForValidation = orderProducts.filter(
      (product) => product.order_product_id && !product.is_cancel,
    );

    if (isSelectedEmployeeTypeEmployee) {
      return true;
    }

    for (const product of productsForValidation) {
      const buyers = product.buyers || [];
      const productName =
        product.order_product_name || product.product?.product_name || "товара";

      if (buyers.length === 0) {
        message.warning(`Заполните сотрудников для ${productName}`);
        return false;
      }

      if (
        buyers.some(
          (buyer) => !buyer.buyer_id || Number(buyer.product_quantity) <= 0,
        )
      ) {
        message.warning(
          `Укажите корректное количество по сотрудникам для ${productName}`,
        );
        return false;
      }

      const totalQuantity = buyers.reduce(
        (sum, buyer) => sum + Number(buyer.product_quantity || 0),
        0,
      );

      if (
        Math.abs(
          Number(totalQuantity.toFixed(2)) -
            Number(product.product_quantity.toFixed(2)),
        ) > 0.001
      ) {
        message.warning(
          `Сумма количеств по сотрудникам должна быть равна количеству товара для ${productName}`,
        );
        return false;
      }
    }

    const productsForUpdate = productsForValidation.filter(
      (product) => (product.buyers || []).length > 0,
    );

    if (productsForUpdate.length === 0) {
      return true;
    }

    await updateOrderProductEmployeesMutationAsync(
      productsForUpdate.map((product: IProductTable) => ({
        order_product_id: product.order_product_id as number,
        employees: (product.buyers || []).map((buyer) => ({
          employee_id: buyer.buyer_id,
          product_quantity: Number(buyer.product_quantity),
        })),
      })),
    );

    return true;
  };

  const agreedOrder = async (order_id: number) => {
    const isValid = await validateAndUpdateOrderProductEmployees();
    if (!isValid) {
      return;
    }

    try {
      await agreedOrderMutationAsync({ order_id, note });
      remove(targetKey);
    } catch {}
  };

  const rejectOrder = async (order_id: number) => {
    if (note === "") {
      message.warning("Введите корректный комментарий");
    } else if (note.length < 5) {
      message.warning("Введите корректный комментарий");
    } else {
      const isValid = await validateAndUpdateOrderProductEmployees();
      if (!isValid) {
        return;
      }

      try {
        await rejectOrderMutationAsync({ order_id, note });
        remove(targetKey);
      } catch {}
    }
  };

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
      storage_id: {
        label: getOrderByIdData?.storage?.storage_name,
        value: getOrderByIdData?.storage?.storage_id,
      },
      ...createOrderDocumentFormState(getOrderByIdData?.documents),
    });
  }, [reset, type, orderid, getOrderByIdData]);

  const syncSubmittedDocuments = (
    documents: Array<
      | string
      | {
          path?: string | null;
          file_name?: string | null;
          file_path?: string | null;
        }
    >,
  ) => {
    const nextDocumentState = createOrderDocumentFormState(documents);

    setValue("documents", nextDocumentState.documents, { shouldDirty: true });
    setValue("existingDocuments", nextDocumentState.existingDocuments, {
      shouldDirty: true,
    });
    setValue("removedDocuments", [], { shouldDirty: true });
    setValue("newDocuments", [], { shouldDirty: true });
  };

  const updateOrder = async () => {
    const data = getValues();
    if (data.order_products && data.order_products.length > 0) {
      const order: Partial<IOrderItemRequest> = {
        order_id: Number(orderid),
        department_id: getOrderByIdData?.department?.department_id,
        order_type: getOrderByIdData?.order_type as EnumOrderTypes,
        employee_id: getOrderByIdData?.buyer?.buyer_id,
        storage_id: getOrderByIdData?.storage?.storage_id,
        oms: getOrderByIdData?.oms || false,
        is_generic: getOrderByIdData?.is_generic,
        note: getOrderByIdData?.note,
        product_group_id: getOrderByIdData?.product_group.product_group_id,
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
              return updateOrderMutationAsync(payload, {
                async onSuccess() {
                  await agreedOrderMutationAsync({ order_id:Number(orderid), note });
                },
              });
            },
          });

          syncSubmittedDocuments(finalDocumentItems);
          remove(targetKey);
      } catch (err) {
        console.error(err);
      }
    } else {
      message.warning("Добавьте товары в заявку !");
    }
  };

  return (
    <div ref={contentRef} className="print">
      {(agreedOrderPending ||
        rejectOrderPending ||
        updateOrderProductEmployeesPending ||
        updateOrderMutationIsPending) && <Spin fullscreen={true} />}
      <div className={style.newOrder}>
        <h1>Заявка на согласовании №: {orderid}</h1>
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

        {!isPrinting && !getOrderByIdData?.is_archive && (
          hasDeleteOrderProductPermission &&
          <button
            onClick={() => {
              if (!getValues("product_group.value")) {
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
        <Tabs
          defaultActiveKey="1"
          items={items}
          onChange={(e) => setActiveTabKey(Number(e))}
        />
        {!readonly && !isPrinting && (
          <div
            className={style.commentAndButtons}
            style={{ display: activeTabKey === 4 ? "none" : "flex" }}
          >
            <TextArea
              placeholder="Комментарий"
              className={style.comment}
              value={note}
              onChange={(e) => setnote(e.target.value)}
            />
            <div className={style.buttonGroup}>
              <button
                className={style.buttonOrderApproval}
                onClick={() => hasDeleteOrderProductPermission ? void updateOrder() : void agreedOrder(Number(orderid))}
                disabled={
                  agreedOrderPending || updateOrderProductEmployeesPending
                }
              >
                Согласовать
              </button>
              <button
                className={`${style.buttonOrderApproval} ${style.buttonOrderApprovalReject}`}
                onClick={() => void rejectOrder(Number(orderid))}
                disabled={
                  rejectOrderPending || updateOrderProductEmployeesPending
                }
              >
                Отклонить
              </button>
            </div>
          </div>
        )}

        {isPrinting && (
          <>
            <h4 style={{ marginTop: "10px" }}>История согласования</h4>
            <OrderStepHistory order_id={Number(orderid)} />
          </>
        )}
      </div>
    </div>
  );
}
