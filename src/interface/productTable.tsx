import { IBasicUnit, IBasicUnitOption } from "./basicUnit";
import {  IEmployeeFromParlorGetMe, IEmployeeOption } from "./employee";
import { IProductUnit } from "./product";
import { IUnit } from "./unit";

export interface IProductTable{
    order_product_id:number | undefined,
    product:IProductUnit,
    unit_measurement:IUnit,
    product_quantity:number
    buyer?:IEmployeeFromParlorGetMe[]
    note?:string,
}

export interface IProductTableRequest{
    product_id: number,
    unit_measurement_id: number,
    product_quantity: number,
    employee_ids?: number[],
    note?: string
}

export interface IProductTableFormValues{
    order_product_id?:number | undefined,
    product:IProductUnit,
    unit_measurement:IBasicUnitOption,
    product_quantity:number
    buyer?:IEmployeeOption[]
    note?:string,
}