import { IBasicUnit, IBasicUnitOption } from "./basicUnit";
import {  IEmployeeFromParlorGetMe, IEmployeeOption } from "./employee";
import { IProductUnit } from "./product";
import { IUnit } from "./unit";

export interface IProductTable{
    id:number | undefined,
    product:IProductUnit,
    unitProductTable:IUnit,
    product_quantity:number
    employee?:IEmployeeFromParlorGetMe[]
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
    id?:number | undefined,
    product:IProductUnit,
    unitProductTable:IBasicUnitOption,
    product_quantity:number
    employee?:IEmployeeOption[]
    note?:string,
}