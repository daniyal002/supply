import { useOrderRouteSteps } from "@/hook/orderHook";
import React from "react";
import RouteInfoTable from "./RouteInfoTable";

interface Props {
  order_id: number;
}

export default function RouteInfo({ order_id }: Props) {
  const { orderRouteSteps } = useOrderRouteSteps(order_id);
  if (!order_id) {
    return null;
  }
  return (
    <div>
      <RouteInfoTable RouteInfoData={orderRouteSteps} />
    </div>
  );
}
