"use client";
import React, { useEffect, useState } from "react";
import OrderListTable from "./OrderListTable";
import { useOrderUserData } from "@/hook/orderHook";
import style from "./OrderList.module.scss";
import { Toaster } from "sonner";
import { IOrderItem } from "@/interface/orderItem";
import { ConfigProvider, DatePicker } from "antd";
import moment from "moment";
import locale from 'antd/locale/ru_RU';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
dayjs.locale('ru_RU');

const { RangePicker } = DatePicker;

export default function OrderList() {
  const { orderUserData } = useOrderUserData();
  const [orderData, setOrderData] = useState<IOrderItem[]>(orderUserData as IOrderItem[]);
  const [filteredOrderData, setFilteredOrderData] = useState<IOrderItem[]>(orderUserData as IOrderItem[]);
  const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment] | null>(null);

  const handleFilter = (dates: [moment.Moment, moment.Moment] | null) => {
    setDateRange(dates);
  };
  useEffect(() => {
    if (dateRange) {
      const [start, end] = dateRange;
      const filteredData = orderData.filter(order => {
        const orderDate = moment(order.created_at).startOf('day');
        const startDate = start.startOf('day');
        const endDate = end.endOf('day');
        const isInRange = orderDate.isSameOrAfter(startDate.format('YYYY-MM-DD')) && orderDate.isSameOrBefore(endDate.format('YYYY-MM-DD'));
        return isInRange;
      });
      setFilteredOrderData(filteredData);
    } else {
      setFilteredOrderData(orderData);
    }
  }, [dateRange, orderData]);


  useEffect(() => {
    setOrderData(orderUserData as IOrderItem[]);
    setFilteredOrderData(orderUserData as IOrderItem[]);
  }, [orderUserData]);

  return (
    <div className={style.orderList}>
      <Toaster />
      <ConfigProvider locale={locale} theme={{token:{colorPrimary:"#678098"}}}>
      <RangePicker
      //@ts-ignore
        value={dateRange}
      //@ts-ignore
        onChange={handleFilter}
        style={{ marginBottom: 16 }}
        format="DD.MM.YYYY"
      />
      </ConfigProvider>

      <OrderListTable OrderData={filteredOrderData} />
    </div>
  );
}