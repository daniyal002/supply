"use client";
import React, { useState, useMemo, useEffect } from "react";
import OrderListTable from "./OrderListAllTable";
import {
  useOrdersData,
  useOrdersWhereUserIsApproverData,
} from "@/hook/orderHook";
import style from "./OrderList.module.scss";
import { Toaster } from "sonner";
import { DatePicker, Switch } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import "dayjs/locale/ru";
dayjs.locale("ru_RU");

const { RangePicker } = DatePicker;

export default function OrderListAll() {
  const [isAllOrder, setIsAllOrder] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<
    [moment.Moment, moment.Moment] | null
  >(null);
  const [orderDateType, setOrderDateType] = useState<
    "created_at" | "updated_at"
  >("created_at");

  const {
    ordersData: ordersDataIsApprover,
    isLoading: isLoadingIsApprover,
    refetch: refetchIsApprover,
  } = useOrdersWhereUserIsApproverData();
  const {
    ordersData: ordersDataIsAll,
    isLoading: isLoadingIsAll,
    refetch: refetchIsAll,
  } = useOrdersData();

  // --- Определяем текущие данные (с учётом isAllOrder и самих данных) ---
  const currentOrdersData = isAllOrder ? ordersDataIsAll : ordersDataIsApprover;
  const currentIsLoading = isAllOrder ? isLoadingIsAll : isLoadingIsApprover;
  const currentRefetch = isAllOrder ? refetchIsAll : refetchIsApprover;

  // --- Обработчик фильтрации ---
  const handleFilter = (dates: [moment.Moment, moment.Moment] | null) => {
    setDateRange(dates);
  };

  // --- Фильтрация по дате ---
  const filteredOrderData = useMemo(() => {
    // Если данных нет — возвращаем пустой массив
    if (!currentOrdersData) return [];

    if (!dateRange) return currentOrdersData;

    const [start, end] = dateRange;
    const startDate = start.startOf("day");
    const endDate = end.endOf("day");

    return currentOrdersData.filter((order) => {
      // const orderDate = moment(order.created_at).startOf("day");
      const orderDate =
        orderDateType === "created_at"
          ? moment(order.created_at).startOf("day")
          : moment(order.updated_at).startOf("day");
      return (
        orderDate.isSameOrAfter(startDate.format("YYYY-MM-DD")) &&
        orderDate.isSameOrBefore(endDate.format("YYYY-MM-DD"))
      );
    });
  }, [currentOrdersData, dateRange, orderDateType]);

  useEffect(() => {
    setDateRange(null);
  }, [orderDateType]);

  useEffect(() => {
    if (isAllOrder) {
      refetchIsAll();
    } else {
      refetchIsApprover();
    }
  }, [isAllOrder, refetchIsAll, refetchIsApprover]);

  return (
    <div className={style.orderList}>
      <Toaster />
      <RangePicker
        //@ts-ignore
        value={dateRange}
        //@ts-ignore
        onChange={handleFilter}
        format="DD.MM.YYYY"
      />
      <Switch
        onChange={(e) => setOrderDateType(e ? "updated_at" : "created_at")}
        checkedChildren={"Дата обновления"}
        unCheckedChildren={"Дата создания"}
        style={{ width: "150px", marginBottom: 16 }}
      />
      <OrderListTable
        OrderData={filteredOrderData}
        loading={currentIsLoading}
        refetch={currentRefetch}
        isAllOrder={isAllOrder}
        setIsAllOrder={setIsAllOrder}
      />
    </div>
  );
}
