import { useOrderStepHistory } from "@/hook/orderHook";
import React from "react";
import OrderStepHistoryTable from "./OrderStepHistoryTable";

interface Props {
  order_id: number;
}

export default function OrderStepHistory({ order_id }: Props) {
  const { orderStepHistory } = useOrderStepHistory(order_id);

  if (!order_id) {
    return null;
  }
  return (
    <div>
      <OrderStepHistoryTable OrderStepHistoryData={orderStepHistory} />
    </div>
  );
}
