"use client";
import React, { useEffect, useState } from "react";
import OrderListTable from "./OrderListTable";
import { useOrderUserData } from "@/hook/orderHook";
import style from "./OrderList.module.scss";
import { Toaster } from "sonner";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db/db";
import OrderListDraftTable from "./OrderListDraftTable";
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
  const orderDraftItem = useLiveQuery(() => db.orderItem.toArray());
  const [filterOrderDraftItem, setFilterOrderDraftItem] = useState<IOrderItem[]>();
  const [orderData, setOrderData] = useState<IOrderItem[]>(orderUserData as IOrderItem[]);
  const [filteredOrderData, setFilteredOrderData] = useState<IOrderItem[]>(orderUserData as IOrderItem[]);
  const [isDraft, setIsDraft] = useState<boolean>(false);
  const GetMeData = useLiveQuery(() => db.getMe.toCollection().first(), []);
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
    const filterOrder = orderDraftItem?.filter(
      (item) => item.user_id === GetMeData?.user_id
    );
    if (filterOrder) {
      setFilterOrderDraftItem(filterOrder as IOrderItem[]);
    }
  }, [orderDraftItem, orderUserData]);

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
      <div className={style.orderListButton}>
        {filterOrderDraftItem?.length !== 0 && (
          <button className={style.draftOrderButton} onClick={() => setIsDraft(!isDraft)}>
            {!isDraft ? "Черновик" : "Все заявки"}
          </button>
        )}
      </div>
      <p data-text={isDraft ? "Черновик" : "Все заявки"} className={style.orderListText}>
        {isDraft ? "Черновик" : "Все заявки"}
      </p>
      {isDraft ? (
        <OrderListDraftTable OrderData={filterOrderDraftItem} />
      ) : (
        <OrderListTable OrderData={filteredOrderData} />
      )}
    </div>
  );
}