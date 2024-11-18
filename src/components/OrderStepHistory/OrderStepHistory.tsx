import { useOrderStepHistory } from '@/hook/orderHook'
import React from 'react'
import OrderStepHistoryTable from './OrderStepHistoryTable'

interface Props {
    order_id:number
}

export default function OrderStepHistory({order_id}:Props) {
    const {orderStepHistory} = useOrderStepHistory(order_id)
  return (
    <div><OrderStepHistoryTable OrderStepHistoryData={orderStepHistory}/></div>
  )
}
