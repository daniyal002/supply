import { IDepartment, IDepartmentOption } from "./department";
import { IEmployeeFromParlorGetMe } from "./employee";
import { IFloor, IFloorOption } from "./floor";

export interface IParlor{
    parlor_id?:number,
    parlor_name:string,
    department:IDepartment | undefined
    floor?: IFloor | undefined
    is_archive?: boolean,

}

export interface IParlorRespone{
    detail:IParlor[]
}

export interface IParlorRequest{
    parlor_id?:number,
    parlor_name:string,
    department_id:number
    floor_id?: number
    is_archive?: boolean,

}

export interface IParlorAddResponse{
    detail:string,
    parlor: IParlor
}

export interface IParlorGetMe{
    parlor_id?:number,
    parlor_name:string,
    department:IDepartment | undefined
    floor?: IFloor | undefined
    employees:IEmployeeFromParlorGetMe[]
}

export interface IParlorFormValues{
    parlor_id?:number,
    parlor_name:string,
    department?:IDepartmentOption
    floor?: IFloorOption
}

export interface IParlorOption {
    value: number;
    label: string;
  }