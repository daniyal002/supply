"use client";
import React, { useEffect, useState } from "react";
import OrderListTable from "./OrderListTable";
import { useOrderUserData } from "@/hook/orderHook";
import Link from "next/link";
import style from "./OrderList.module.scss";
import { Toaster } from "sonner";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db/db";
import OrderListDraftTable from "./OrderListDraftTable";
import { IOrderItem } from "@/interface/orderItem";
import { useGetMe } from "@/hook/userHook";
import { Button } from "antd";

export default function OrderList() {
  const { orderUserData } = useOrderUserData();
  const orderDraftItem = useLiveQuery(() => db.orderItem.toArray());
  const [filterOrderDraftItem, setFilterOrderDraftItem] =
    useState<IOrderItem[]>();
  const [orderData, setOrderData] = useState<IOrderItem[]>(
    orderUserData as IOrderItem[]
  );

  const [isDraft, setIsDraft] = useState<boolean>(false);

  const GetMeData = useLiveQuery(() => db.getMe.toCollection().first(), []);

  const onEdit = (id: number) => console.log(id);

  useEffect(() => {
    const filterOrder = orderDraftItem?.filter(
      (item) => item.user_id === GetMeData?.user_id
    );
    if (filterOrder) {
      console.log(GetMeData?.user_id);
      setFilterOrderDraftItem(filterOrder as IOrderItem[]);
    }
    console.log(orderDraftItem);
  }, [orderDraftItem, orderUserData]);

  useEffect(() => {
    setOrderData(orderUserData as IOrderItem[]);
  }, [orderUserData]);

  return (
    <div className={style.orderList}>
      <Toaster />
      <div className={style.orderListButton}>
        <Link href={"/order/newOrder"} className={style.newOrderButton}>
          Создать заявку
        </Link>
        {filterOrderDraftItem?.length !== 0  && (
          <button  className={style.draftOrderButton} onClick={() => setIsDraft(!isDraft)}>{!isDraft ? "Черновик" : "Все заявки"}</button>
        )}
      </div>
        <p data-text={isDraft ? "Черновик" : "Все заявки"} className={style.orderListText}>{isDraft ? "Черновик" : "Все заявки"}</p>
      {isDraft ? (
        <OrderListDraftTable OrderData={filterOrderDraftItem} onEdit={onEdit} />
      ) : (
        <OrderListTable OrderData={orderData} onEdit={onEdit} />
      )}
    </div>
  );
}
