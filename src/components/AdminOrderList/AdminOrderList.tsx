"use client";
import React, { useEffect, useState } from "react";
import OrderListTable from "./AdminOrderListTable";
import { useOrdersData } from "@/hook/orderHook";
import style from "./OrderList.module.scss";
import { Toaster } from "sonner";
import { IOrderItem } from "@/interface/orderItem";
import { Button, DatePicker, Radio, Switch } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { BookFilled } from "@ant-design/icons";
import OrderCardWrapper from "../OrderCard/OrderCardWrapper";
dayjs.locale("ru_RU");

const { RangePicker } = DatePicker;

export default function AdminOrderList() {
  const { ordersData, refetch,isLoading } = useOrdersData();
  const [orderDateType, setOrderDateType] = useState<
    "created_at" | "updated_at"
  >("created_at");
  const [orderData, setOrderData] = useState<IOrderItem[]>(
    ordersData as IOrderItem[]
  );
  const [filteredOrderData, setFilteredOrderData] = useState<IOrderItem[]>(
    ordersData as IOrderItem[]
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
    setOrderData(ordersData as IOrderItem[]);
    setFilteredOrderData(ordersData as IOrderItem[]);
  }, [ordersData]);

  const [isArchive, setIsArchive] = useState<boolean>(false);

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
       <Radio.Group defaultValue={orderDateType}>
        <Radio value="created_at" onChange={() => setOrderDateType("created_at")} >Дата создания</Radio>
        <Radio value="updated_at" onChange={() => setOrderDateType("updated_at")}>Дата обновления</Radio>
      </Radio.Group>
      <Button
        type="primary"
        shape="circle"
        icon={<BookFilled />}
        onClick={() => setIsArchive(!isArchive)}
        style={{
          marginBottom: "10px",
          color: isArchive ? "" : "#fff",
          backgroundColor: isArchive ? "" : "gray",
        }}
        title={isArchive ? "Не архивные" : "Архивные"}
      />
<div className={style.orderListTable}>
      <OrderListTable
        OrderData={filteredOrderData}
        isArchive={isArchive}
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
