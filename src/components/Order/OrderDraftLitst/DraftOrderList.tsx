"use client";
import React, { useEffect, useState } from "react";
import OrderListTable from "./DraftOrderListTable";
import { useOrderUserData } from "@/hook/orderHook";
import style from "./DraftOrderList.module.scss";
import { toast, Toaster } from "sonner";
import { IOrderItem } from "@/interface/orderItem";
import { Button, ConfigProvider, DatePicker } from "antd";
import moment from "moment";
import locale from "antd/locale/ru_RU";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { useDeleteDraftOrderAllMutation, useDraftOrderUserData } from "@/hook/orderTempHook";
dayjs.locale("ru_RU");

const { RangePicker } = DatePicker;

export default function DraftOrderList() {
  const { draftOrderUserData,isLoading } = useDraftOrderUserData();
  const [orderData, setOrderData] = useState<IOrderItem[]>(
    draftOrderUserData as IOrderItem[]
  );
  const [filteredOrderData, setFilteredOrderData] = useState<IOrderItem[]>(
    draftOrderUserData as IOrderItem[]
  );
  const [dateRange, setDateRange] = useState<
    [moment.Moment, moment.Moment] | null
  >(null);

  const handleFilter = (dates: [moment.Moment, moment.Moment] | null) => {
    setDateRange(dates);
  };
  useEffect(() => {
    if (dateRange) {
      const [start, end] = dateRange;
      const filteredData = orderData.filter((order) => {
        const orderDate = moment(order.created_at).startOf("day");
        const startDate = start.startOf("day");
        const endDate = end.endOf("day");
        const isInRange =
          orderDate.isSameOrAfter(startDate.format("YYYY-MM-DD")) &&
          orderDate.isSameOrBefore(endDate.format("YYYY-MM-DD"));
        return isInRange;
      });
      setFilteredOrderData(filteredData);
    } else {
      setFilteredOrderData(orderData);
    }
  }, [dateRange, orderData]);

  useEffect(() => {
    setOrderData(draftOrderUserData as IOrderItem[]);
    setFilteredOrderData(draftOrderUserData as IOrderItem[]);
  }, [draftOrderUserData]);

  const {mutate:deleteDraftOrderAllMutation,isPending} = useDeleteDraftOrderAllMutation()

  return (
    <div className={style.orderList}>
      <Button danger type="primary" loading={isPending} onClick={() =>
                toast.error("Вы точно хотите удалить все черновики ?", {
                  style: {
                    color: "red",
                  },
                  action: {
                    label: "Удалить",
                    onClick: () =>
                      deleteDraftOrderAllMutation(),
                  },
                })
              }>Удалить все черновики</Button>
      <Toaster />
      <ConfigProvider
        locale={locale}
        theme={{ token: { colorPrimary: "#678098" } }}
      >
        <RangePicker
          //@ts-ignore
          value={dateRange}
          //@ts-ignore
          onChange={handleFilter}
          style={{ marginBottom: 16 }}
          format="DD.MM.YYYY"
        />
      </ConfigProvider>
      <OrderListTable OrderData={filteredOrderData} loading={isLoading} />
    </div>
  );
}
