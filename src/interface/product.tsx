import { IBasicUnit } from "./basicUnit";
import { IUnit } from "./unit";

export interface IProduct{
    id?:number,
    product_name:string,
    product_group:string,
    unit_measurement:IBasicUnit
}

export interface IProductGroup{
    id:1,
    name:string
}

export interface IProductUnit{
    product_id: number,
    product_name: string,
    unit_measurement: IBasicUnit,
    product_group: IProductGroup
    directory_unit_measurement:IUnit[]
}

export interface IProductResponse{
    detail:IProductUnit[]
}