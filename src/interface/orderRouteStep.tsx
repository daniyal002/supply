import { IStatusOrder } from "./orderItem";
import { IProductGroup } from "./product";

export interface IOrderRouteStepRequest {
  step_id?:number,
  route_id?: number;
//   employee_id: number;
  step_number: number;
  free_or_paid: "free" | "paid";
  status_reject_id: number;
  status_agreed_id: number;
  product_group_ids: number[];
  approver_employee_ids:number[]
}

export interface IOrderRouteStepProductGroup {
  order_route_step_id: number;
  product_group_id: number;
}

export interface IOrderRouteStepApprovers {
  employee_id: number;
  employee_name: string;
}

export interface IOrderRouteStepResponse {
//   step_id: any;
  step_id?:number,
  route_id?: number;
//   employee: IEmployee;
  step_number: number;
  free_or_paid: "free" | "paid";
  status_reject: IStatusOrder;
  status_agreed: IStatusOrder;
  product_groups: IProductGroup[];
  approvers: IOrderRouteStepApprovers[];
}
