'use client'
import React from 'react'
import OrderListTable from './OrderListTable'
import { useOrderUserData } from '@/hook/orderHook'
import Link from 'next/link'

export default function OrderList() {
    const {orderUserData} = useOrderUserData()

    const onEdit = (id:number) => console.log(id)

  return (
    <div>
        <Link href={'/order/newOrder'}>Добавить заявку</Link>
        <OrderListTable OrderData={orderUserData} onEdit={onEdit}/>
    </div>
  )
}
