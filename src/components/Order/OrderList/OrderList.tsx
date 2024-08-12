'use client'
import React from 'react'
import OrderListTable from './OrderListTable'
import { useOrderUserData } from '@/hook/orderHook'
import Link from 'next/link'
import style from "./OrderList.module.scss"

export default function OrderList() {
    const {orderUserData} = useOrderUserData()

    const onEdit = (id:number) => console.log(id)

  return (
    <div className={style.orderList}>
        <Link href={'/order/newOrder'} className={style.newOrderButton}>Добавить заявку</Link>
        <OrderListTable OrderData={orderUserData} onEdit={onEdit}/>
    </div>
  )
}
