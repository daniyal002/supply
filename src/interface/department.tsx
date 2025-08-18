import { HousingOption, IHousing } from "./housing"

export interface IDepartment{
    department_id?:number,
    department_name: string,
    is_archive?: boolean,
    housing:IHousing | undefined,
    is_generic:boolean

}

export interface IDepartmentResponse{
    detail:IDepartment[]
}

export interface IDepartmentRequest{
    department_id?:number,
    department_name: string
    housing_id:number
    is_generic:boolean

}

export interface IDepartmentAddResponse{
    detail:string,
    department: IDepartment
}

export interface IDepartmentFormValues {
    department_id?: number;
    department_name: string;
    housing?: HousingOption;
    is_generic:boolean
  }

export interface IDepartmentOption {
    value: number;
    label: string;
  }