import { IDepartment, IDepartmentOption } from "@/interface/department";
import { IEmployee, IEmployeeOption } from "@/interface/employee";
import { IProductTable, IProductTableRequest } from "@/interface/productTable";
import { IProductGroup, IProductGroupOption } from "./product";

export interface IStatusOrder{
  order_status_id:number,
  order_status_name:string,
}

export interface IStatusOrderResponse{
  detail:IStatusOrder[]
}

export interface IOrderItem {
    order_id?:number;
    order_number: string;
    created_at?: string;
    updated_at? : string;
    order_status:IStatusOrder;
    note?:string,
    buyer: IEmployee | undefined;
    oms:true | false,
    department:IDepartment | undefined;
    product_group:IProductGroup,
    order_products?:IProductTable[];
    user_id?:number
  }

  export interface IOrderItemAddResponse{
    detail:string,
    order:IOrderItem
  }

  export interface IOrderItemRequest{
    order_id?:number
    order_number?: string,
    oms: boolean,
    order_status_id: number,
    // order_route_id: number,
    employee_id: number,
    department_id: number,
    product_group_id:number,
    note?: string,
    products: IProductTableRequest[]
  }

  export interface IOrderItemRequestDelete{
    order_id?:number
    order_number?: string,
  }


  export interface IOrderItemFormValues{
    order_id?:number
    order_number?: string,
    oms: boolean,
    user_id?: number,
    order_status_id: number,
    order_route_id: number,
    employee_id: IEmployeeOption,
    department_id: IDepartmentOption,
    product_group:IProductGroupOption,
    note: string,
    order_products: IProductTable[]
  }

  export interface IOrderItemResponse{
    detail:IOrderItem[]
  }
  export interface IOrderItemByIdResponse{
    detail:IOrderItem
  }