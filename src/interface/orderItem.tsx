import { IDepartment, IDepartmentOption } from "@/interface/department";
import { IEmployee, IEmployeeOption } from "@/interface/employee";
import { IProductTable, IProductTableRequest } from "@/interface/productTable";
import { IProductGroup, IProductGroupOption } from "./product";
import { IUser } from "./user";
import { IStorage, IStorageOption } from "./storage";

export enum EnumOrderTypes {
  'PURCHASE' = 'purchase',
  'WAREHOUSE' = 'warehouse',
}

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
    order_type:EnumOrderTypes.WAREHOUSE | EnumOrderTypes.PURCHASE;
    created_at?: string;
    updated_at? : string;
    order_status:IStatusOrder;
    note?:string,
    buyer: IEmployee | undefined;
    oms:true | false,
    department:IDepartment | undefined;
    storage:IStorage | undefined;
    product_group:IProductGroup,
    order_products?:IProductTable[],
    user_id?:number,
    current_step_container:number | null,
    in_route: boolean,
    user?:IUser
    order_author_name?:string
    is_archive?:boolean
  }

  export interface IDraftOrderItem {
    order_temp_id?:number;
    order_number: string;
    created_at?: string;
    updated_at? : string;
    order_status:IStatusOrder;
    note?:string,
    buyer: IEmployee | undefined;
    oms:true | false,
    department:IDepartment | undefined;
    order_type:EnumOrderTypes.WAREHOUSE | EnumOrderTypes.PURCHASE;
    storage:IStorage | undefined;
    product_group:IProductGroup,
    order_products?:IProductTable[],
    user_id?:number,
    current_step_container:number | null,
    in_route: boolean,
    user?:IUser
    is_archive?:boolean

  }

  export interface IOrderItemAddResponse{
    detail:string,
    order:IOrderItem
  }

  export interface IDraftOrderItemAddResponse{
    detail:string,
    order:IDraftOrderItem,
  }

  export interface IOrderItemRequest{
    order_id?:number
    order_number?: string,
    oms: boolean,
    order_type:EnumOrderTypes.WAREHOUSE | EnumOrderTypes.PURCHASE;
    order_status_id: number,
    employee_id: number,
    department_id: number,
    storage_id:number,
    product_group_id:number,
    note?: string,
    products: IProductTableRequest[]
  }

  export interface IDraftOrderItemRequest{
    order_temp_id?:number
    order_number?: string,
    oms: boolean,
    order_type:EnumOrderTypes.WAREHOUSE | EnumOrderTypes.PURCHASE;
    order_status_id: number,
    employee_id: number,
    department_id: number,
    storage_id:number,
    product_group_id:number,
    note?: string,
    products: IProductTableRequest[]
  }

  export interface IOrderItemRequestDelete{
    order_id?:number
    order_number?: string,
  }

  export interface IOrderDrafttemRequestDelete{
    order_temp_id?:number
  }


  export interface IOrderItemFormValues{
    order_id?:number
    order_number?: string,
    oms: boolean,
    user_id?: number,
    order_author_name?:string,
    order_type:IOrderTypesOption;
    order_status_id: number,
    order_route_id: number,
    employee_id: IEmployeeOption,
    department_id: IDepartmentOption,
    storage_id:IStorageOption,
    product_group:IProductGroupOption,
    note: string,
    order_products: IProductTable[]
    is_archive?:boolean
  }



  export interface IOrderDraftItemFormValues{
    order_temp_id?:number
    order_number?: string,
    oms: boolean,
    user_id?: number,
    order_status_id: number,
    order_type:IOrderTypesOption;
    order_route_id: number,
    employee_id: IEmployeeOption,
    department_id: IDepartmentOption,
    storage_id:IStorageOption,
    product_group:IProductGroupOption,
    note: string,
    order_products: IProductTable[]
    is_archive?:boolean
  }

  export interface IOrderItemResponse{
    detail:IOrderItem[]
  }

  export interface IOrderDraftItemResponse{
    detail:IDraftOrderItem[]
  }
  export interface IOrderItemByIdResponse{
    detail:IOrderItem
  }

  export interface IOrderDraftItemByIdResponse{
    detail:IDraftOrderItem
  }

  export interface IOrderTypesOption {
      value: EnumOrderTypes.WAREHOUSE | EnumOrderTypes.PURCHASE;
      label: string;
  }

  export interface IOrderTo1CRequest {
    order_id: number;
    note?: string;
  }

  export interface IOrderArchiveRequest {
    order_id: number;
    archive_note: string;
  }