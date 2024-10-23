"use client";
import React, { useEffect, useState } from "react";
import ApprovalListTable from "./ApprovalListTable";
import { useApprovalOrders } from "@/hook/orderHook";
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

export default function ApprovalList() {
  const { approvalOrders } = useApprovalOrders();
  const [orderData, setOrderData] = useState<IOrderItem[]>(approvalOrders as IOrderItem[]);
  const [filteredOrderData, setFilteredOrderData] = useState<IOrderItem[]>(approvalOrders as IOrderItem[]);
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
    setOrderData(approvalOrders as IOrderItem[]);
    setFilteredOrderData(approvalOrders as IOrderItem[]);
  }, [approvalOrders]);

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
      <div className={style.orderListButton}>

      </div>
      <p data-text={"Заявки на согласовании"} className={style.orderListText}>
        Заявки на согласовании
      </p>

        <ApprovalListTable OrderData={filteredOrderData} />
    </div>
  );
}