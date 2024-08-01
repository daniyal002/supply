import { IDepartment, IDepartmentOption } from "./department";
import { IEmployeeFromParlorGetMe } from "./employee";
import { IFloor, IFloorOption } from "./floor";

export interface IParlor{
    id?:number,
    parlor_name:string,
    department:IDepartment | undefined
    floor?: IFloor | undefined
}

export interface IParlorRespone{
    detail:IParlor[]
}

export interface IParlorRequest{
    id?:number,
    parlor_name:string,
    department_id:number
    floor_id?: number
}

export interface IParlorAddResponse{
    detail:string,
    parlor: IParlor
}

export interface IParlorGetMe{
    id?:number,
    parlor_name:string,
    department:IDepartment | undefined
    floor?: IFloor | undefined
    employees:IEmployeeFromParlorGetMe[]
}

export interface IParlorFormValues{
    id?:number,
    parlor_name:string,
    department?:IDepartmentOption
    floor?: IFloorOption
}

export interface IParlorOption {
    value: number;
    label: string;
  }