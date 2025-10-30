"use client";
import React, { useEffect, useState } from "react";
import ApprovalListTable from "./ApprovalListTable";
import { useApprovalOrders } from "@/hook/orderHook";
import style from "./ApprovalList.module.scss";
import { Toaster } from "sonner";
import { IOrderItem } from "@/interface/orderItem";
import { DatePicker, Radio } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import OrderCardWrapper from "@/components/OrderCard/OrderCardWrapper";

dayjs.locale("ru_RU");

const { RangePicker } = DatePicker;

export default function ApprovalList() {
  const { approvalOrders, isLoading, refetch } = useApprovalOrders();
  const [orderDateType, setOrderDateType] = useState<
    "created_at" | "updated_at"
  >("created_at");
  const [orderData, setOrderData] = useState<IOrderItem[]>(
    approvalOrders as IOrderItem[]
  );
  const [filteredOrderData, setFilteredOrderData] = useState<IOrderItem[]>(
    approvalOrders as IOrderItem[]
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
    setOrderData(approvalOrders as IOrderItem[]);
    setFilteredOrderData(approvalOrders as IOrderItem[]);
  }, [approvalOrders]);

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
      <Radio.Group defaultValue={orderDateType}>
        <Radio
          value="created_at"
          onChange={() => setOrderDateType("created_at")}
        >
          Дата создания
        </Radio>
        <Radio
          value="updated_at"
          onChange={() => setOrderDateType("updated_at")}
        >
          Дата обновления
        </Radio>
      </Radio.Group>
      <div className={style.orderListTable}>
        <ApprovalListTable
          OrderData={filteredOrderData}
          loading={isLoading}
          refetch={refetch}
        />
      </div>
      <div className={style.orderCards}>
        <OrderCardWrapper
          OrderData={filteredOrderData}
          loading={isLoading}
          refetch={refetch}
          isDraft={false}
        />
      </div>
    </div>
  );
}
