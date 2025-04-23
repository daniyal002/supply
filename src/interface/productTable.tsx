import { IBasicUnitOption } from "./basicUnit";
import { IEmployeeFromParlorGetMe, IEmployeeOption } from "./employee";
import { IOrderProductCancelCommentResponse, IOrderProductCommentsResponse } from "./orderProductComments";
import { IProductUnit } from "./product";
import { IUnit } from "./unit";

export interface IProductTable {
  order_product_id: number | undefined;
  product: IProductUnit;
  order_product_name?: string;
  order_product_link?: string;
  unit_measurement: IUnit;
  product_quantity: number;
  buyers?: IEmployeeFromParlorGetMe[];
  order_product_comment?: IOrderProductCommentsResponse[];
  order_cancel_comment:IOrderProductCancelCommentResponse;
  is_cancel?: boolean;
  note?: string;
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
