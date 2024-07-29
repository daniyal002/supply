import { IDepartment } from "@/interface/department";
import { IEmployee } from "@/interface/employee";
import { IProductTable, IProductTableRequest } from "@/interface/productTable";

export interface IOrderItem {
    id:number;
    number: string;
    date: string;
    status: string;
    initiator: IEmployee | undefined;
    OMS:true | false,
    department:IDepartment | undefined;
    // parlor:IParlor | undefined;
    productOrder?:IProductTable[];
  }


  export interface IOrderItemRequest{
    id?:number
    oms: boolean,
    user_id: number,
    order_status_id: number,
    order_route_id: number,
    employee_id: number,
    department_id: number,
    note: string,
    products: IProductTableRequest[]
  }