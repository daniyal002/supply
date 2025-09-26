"use client";
import React, { useEffect, useState } from "react";
import OrderListTable from "./DraftOrderListTable";
import style from "./DraftOrderList.module.scss";
import { toast, Toaster } from "sonner";
import { IOrderItem } from "@/interface/orderItem";
import { Button, DatePicker, Switch } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import {
  useDeleteDraftOrderAllMutation,
  useDraftOrderUserData,
} from "@/hook/orderTempHook";
dayjs.locale("ru_RU");

const { RangePicker } = DatePicker;

export default function DraftOrderList() {
  const { draftOrderUserData, isLoading, refetch } = useDraftOrderUserData();
  const [orderDateType, setOrderDateType] = useState<
    "created_at" | "updated_at"
  >("created_at");
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
    setDateRange(null);
  }, [orderDateType]);

  useEffect(() => {
    if (dateRange) {
      const [start, end] = dateRange;
      const filteredData = orderData.filter((order) => {
        const orderDate =
          orderDateType === "created_at"
            ? moment(order.created_at).startOf("day")
            : moment(order.updated_at).startOf("day");
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
  }, [dateRange, orderData, orderDateType]);

  useEffect(() => {
    setOrderData(draftOrderUserData as IOrderItem[]);
    setFilteredOrderData(draftOrderUserData as IOrderItem[]);
  }, [draftOrderUserData]);

  const { mutate: deleteDraftOrderAllMutation, isPending } =
    useDeleteDraftOrderAllMutation();

  return (
    <div className={style.orderList}>
      <Button
        danger
        type="primary"
        loading={isPending}
        onClick={() =>
          toast.error("Вы точно хотите удалить все черновики ?", {
            style: {
              color: "red",
            },
            action: {
              label: "Удалить",
              onClick: () => deleteDraftOrderAllMutation(),
            },
          })
        }
      >
        Удалить все черновики
      </Button>
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
        loading={isLoading}
        refetch={refetch}
      />
    </div>
  );
}
