export interface IBasicUnit{
    unit_measurement_id?:number,
    unit_measurement_name:string,
 }

 export interface IUnitMeasurement{
  detail:IBasicUnit[]
 }

export interface IBasicUnitOption {
    value: number;
    label: string;
  }