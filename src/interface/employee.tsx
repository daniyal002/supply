import { IParlor, IParlorGetMe, IParlorOption } from "./parlor"
import { IPost, IPostOption } from "./post"

export interface IEmployee{
    id?:number
    buyer_name: string,
    buyer_type: string,
    buyer_1C_code?: string,
    email?: string,
    phone?: string,
    internal_phone?: string,
    note?: string
    post:IPost,
    parlor:IParlor[] | undefined
} 


export interface IEmployeeResponse{
    detail:IEmployee[]
}

export interface IEmployeeRequest{
    employee:{
    id?:number
    buyer_name: string,
    buyer_type: string,
    post_id: number,
    buyer_1C_code?: string,
    email?: string,
    phone?: string,
    internal_phone?: string,
    note?: string
    },
    parlor_ids:number[]
}

export interface IEmployeeAddResponse{
    detail:string,
    employee: IEmployee
}

export interface IEmployeeGetMe{
    id?:number
    buyer_name: string,
    buyer_type: string,
    buyer_1C_code?: string,
    email?: string,
    phone?: string,
    internal_phone?: string,
    note?: string
    post:IPost,
    parlor:IParlorGetMe[] | undefined
} 

export interface IEmployeeFromParlorGetMe{
        id: number,
        buyer_name: string
        buyer_type: string,
        post: string,
        role: string
}
// export interface IDoctorParlor{
//     key:number,
//     employee_id:number,
//     parlor_id:number
// }

export interface IEmployeeFormValues{
    id?:number
    buyer_name: string,
    buyer_type: {value:string, label:string},
    buyer_1C_code?: string,
    email?: string,
    phone?: string,
    internal_phone?: string,
    note?: string
    post:IPostOption,
    parlor:IParlorOption[] | undefined
}


export interface IEmployeeOption {
    value: number;
    label: string;
  }