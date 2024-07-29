import { IHousing } from "./housing"

export interface IDepartment{
    id?:number,
    department_name: string 
    housing:IHousing | undefined
}

export interface IDepartmentResponse{
    detail:IDepartment[]
}

export interface IDepartmentRequest{
    id?:number,
    department_name: string 
    housing_id:number
}

export interface IDepartmentAddResponse{
    detail:string,
    department: IDepartment
}