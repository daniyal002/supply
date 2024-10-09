import { IBasicUnit } from "./basicUnit";
import { IUnit } from "./unit";

export interface IProduct{
    id?:number,
    product_name:string,
    product_group:string,
    unit_measurement:IBasicUnit
}

export interface IProductGroup{
    product_group_id:number,
    product_group_name:string
}

export interface IProductGroupResponse{
    detail:IProductGroup[]
}

export interface IProductGroupOption{
    value:number,
    label:string
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