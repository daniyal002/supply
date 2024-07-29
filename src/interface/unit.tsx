import { IBasicUnit } from "./basicUnit";

export interface IUnit{
    id?:number,
    unit_measurement:IBasicUnit,
    coefficient:number,
}