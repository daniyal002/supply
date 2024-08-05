import { IDepartment, IDepartmentOption } from "@/interface/department";
import { IEmployee, IEmployeeOption } from "@/interface/employee";
import { IProductTable, IProductTableRequest } from "@/interface/productTable";

export interface IOrderItem {
    id:number;
    order_number: string;
    created_at: string;
    status: string;
    employee: IEmployee | undefined;
    OMS:true | false,
    department:IDepartment | undefined;
    // parlor:IParlor | undefined;
    productOrder?:IProductTable[];
  }


  export interface IOrderItemRequest{
    id?:number
    oms: boolean,
    order_status_id: number,
    order_route_id: number,
    employee_id: number,
    department_id: number,
    note?: string,
    products: IProductTableRequest[]
  }

  
  export interface IOrderItemFormValues{
    id?:number
    oms: boolean,
    user_id: number,
    order_status_id: number,
    order_route_id: number,
    employee_id: IEmployeeOption,
    department_id: IDepartmentOption,
    note: string,
    products: IProductTable[]
  }