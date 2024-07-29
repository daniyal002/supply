import { IBasicUnit } from "./basicUnit";
import {  IEmployeeFromParlorGetMe } from "./employee";
import { IProductUnit } from "./product";

export interface IProductTable{
    id:number | undefined,
    product:IProductUnit,
    unitProductTable:IBasicUnit,
    count:number
    doctorParlor?:IEmployeeFromParlorGetMe[]
}

export interface IProductTableRequest{
    product_id: number,
    unit_measurement_id: number,
    product_quantity: number,
    employee_id?: number[],
    note?: string
}