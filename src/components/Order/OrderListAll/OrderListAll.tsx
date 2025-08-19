"use client";
import React, { useState, useMemo, useEffect } from "react";
import OrderListTable from "./OrderListAllTable";
import { useOrdersData, useOrdersWhereUserIsApproverData } from "@/hook/orderHook";
import style from "./OrderList.module.scss";
import { Toaster } from "sonner";
import { IOrderItem } from "@/interface/orderItem";
import { DatePicker } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import "dayjs/locale/ru";
dayjs.locale("ru_RU");

const { RangePicker } = DatePicker;

export default function OrderListAll() {
  const [isAllOrder, setIsAllOrder] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment] | null>(null);

  const { ordersData: ordersDataIsApprover, isLoading: isLoadingIsApprover, refetch: refetchIsApprover } =
    useOrdersWhereUserIsApproverData();
  const { ordersData: ordersDataIsAll, isLoading: isLoadingIsAll, refetch: refetchIsAll } =
    useOrdersData();

  // --- Определяем текущие данные (с учётом isAllOrder и самих данных) ---
  const currentOrdersData = isAllOrder ? ordersDataIsAll : ordersDataIsApprover;
  const currentIsLoading = isAllOrder ? isLoadingIsAll : isLoadingIsApprover;
  const currentRefetch = isAllOrder ? refetchIsAll : refetchIsApprover;

  // --- Фильтрация по дате ---
  const filteredOrderData = useMemo(() => {
    // Если данных нет — возвращаем пустой массив
    if (!currentOrdersData) return [];

    if (!dateRange) return currentOrdersData;

    const [start, end] = dateRange;
    const startDate = start.startOf("day");
    const endDate = end.endOf("day");

    return currentOrdersData.filter((order) => {
      const orderDate = moment(order.created_at).startOf("day");
      return orderDate.isSameOrAfter(startDate) && orderDate.isSameOrBefore(endDate);
    });
  }, [currentOrdersData, dateRange]);

  // --- Обработчик фильтрации ---
  const handleFilter = (dates: [moment.Moment, moment.Moment] | null) => {
    setDateRange(dates);
  };

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
        style={{ marginBottom: 16 }}
        format="DD.MM.YYYY"
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