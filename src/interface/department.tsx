import { HousingOption, IHousing } from "./housing"

export interface IDepartment{
    department_id?:number,
    department_name: string 
    housing:IHousing | undefined
}

export interface IDepartmentResponse{
    detail:IDepartment[]
}

export interface IDepartmentRequest{
    department_id?:number,
    department_name: string 
    housing_id:number
}

export interface IDepartmentAddResponse{
    detail:string,
    department: IDepartment
}

export interface IDepartmentFormValues {
    department_id?: number;
    department_name: string;
    housing?: HousingOption;
  }

export interface IDepartmentOption {
    value: number;
    label: string;
  }