import { IBasicUnitOption } from "./basicUnit";
import { IEmployeeFromParlorGetMe, IEmployeeOption } from "./employee";
import {
  IOrderProductCancelCommentResponse,
  IOrderProductCommentsResponse,
} from "./orderProductComments";
import { IProductUnit } from "./product";
import { IUnit } from "./unit";

export interface IOrderProductStatus{
  product_status_id?:number;
  product_status_name?:string;
  product_status_color?:string
}

export interface IProductTable {
  order_product_id: number | undefined;
  product: IProductUnit;
  order_product_name?: string;
  order_product_link?: string;
  unit_measurement: IUnit;
  product_quantity: number;
  buyers?: IEmployeeFromParlorGetMe[];
  order_product_comment?: IOrderProductCommentsResponse[];
  order_cancel_comment: IOrderProductCancelCommentResponse;
  product_previous_orders: IProductPreviousOrders[];
  is_cancel?: boolean;
  note?: string;
  order_product_status?:IOrderProductStatus
  remainder?:number
}

export interface IProductTableRequest {
  product_id: number;
  unit_measurement_id: number;
  order_product_name?: string;
  order_product_link?: string;
  product_quantity: number;
  employee_ids?: number[];
  note?: string;
}

export interface IProductTableFormValues {
  order_product_id?: number | undefined;
  product: IProductUnit;
  order_product_name?: string;
  order_product_link?: string;
  unit_measurement: IBasicUnitOption;
  product_quantity: number;
  buyers?: IEmployeeOption[];
  note?: string;
}

export interface IProductPreviousOrders {
  created_at: string;
  note: string;
  order_product_id: number;
  order_product_name: string;
  product_quantity: number;
  product_count: number;
  updated_at: string;
  order_id:number;
  buyer_name:string;
  unit_measurement_name:string
  is_cancel:boolean
}
