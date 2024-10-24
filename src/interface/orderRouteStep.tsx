import { IEmployee } from "./employee"
import { IStatusOrder, IStatusOrderResponse } from "./orderItem"
import { IProductGroup } from "./product"

export interface IOrderRouteStepRequest{
    // step_id?:number,
    route_id?:number
    employee_id:number
    step_number:number
    free_or_paid:"free" | "paid"
    status_reject_id:number
    status_agreed_id:number
    product_group_ids: number[];
}

export interface IOrderRouteStepProductGroup{
    order_route_step_id:number
    product_group_id:number
}

export interface IOrderRouteStepResponse{
    // step_id?:number,
    route_id?:number
    employee:IEmployee
    step_number:number
    free_or_paid:"free" | "paid"
    status_reject_id:IStatusOrder
    status_agreed_id:IStatusOrder
    product_group_ids: IProductGroup[];
}