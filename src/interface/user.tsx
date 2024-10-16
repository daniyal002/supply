import { IEmployee, IEmployeeGetMe, IEmployeeOption } from "./employee";
import { IRole, IRoleOption } from "./role";

export interface IUser{
    user_id?:number,
    login:string,
    password:string,
    role:IRole | undefined,
    employee:IEmployee,
}

export interface IUserResponse{
    detail: IUser[]
}

export interface IUserRequest{
    user_id?:number,
    login:string,
    password:string,
    role_id:number,
    employee_id:number,
}

export interface IUserAddResponse{
    detail:string,
    user: IUser
}

export interface IGetMe{
    user_id?:number,
    login:string,
    password:string,
    role:IRole | undefined,
    employee:IEmployeeGetMe,
}

export interface IUserFormValues{
    user_id?:number,
    login:string,
    password:string,
    role:IRoleOption
    employee:IEmployeeOption,
}