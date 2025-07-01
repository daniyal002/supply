import { IParlor, IParlorGetMe, IParlorOption } from "./parlor"
import { IPost, IPostOption } from "./post"
import { IStorage, IStorageOption } from "./storage"

export interface IEmployee{
    buyer_id?:number
    buyer_name: string,
    buyer_type: string,
    buyer_1C_code?: string,
    email?: string,
    phone?: string,
    internal_phone?: string,
    note?: string
    post?:IPost,
    parlors:IParlor[] | undefined
    storages:IStorage[] | undefined
    is_archive?: boolean,
}


export interface IEmployeeResponse{
    detail:IEmployee[]
}

export interface IEmployeeRequest{
    employee:{
    buyer_id?:number
    buyer_name: string,
    buyer_type: string,
    post_id: number,
    buyer_1C_code?: string,
    email?: string,
    phone?: string,
    internal_phone?: string,
    note?: string
    is_archive?: boolean,
    },
    parlor_ids:number[]
    storage_ids:number[]
}

export interface IEmployeeAddResponse{
    detail:string,
    employee: IEmployee
}

export interface IEmployeeGetMe{
    buyer_id?:number
    buyer_name: string,
    buyer_type: string,
    buyer_1C_code?: string,
    email?: string,
    phone?: string,
    internal_phone?: string,
    note?: string
    post:IPost,
    parlors:IParlorGetMe[] | undefined
    storages:IStorage[] | undefined

}

export interface IEmployeeFromParlorGetMe{
        buyer_id: number,
        buyer_name: string
        buyer_type: string,
        buyer_post: string,
        buyer_role: string
}

export interface IEmployeeFormValues{
    buyer_id?:number
    buyer_name: string,
    buyer_type: {value:string, label:string},
    buyer_1C_code?: string,
    email?: string,
    phone?: string,
    internal_phone?: string,
    note?: string
    post:IPostOption,
    parlor:IParlorOption[] | undefined
    storages:IStorageOption[] | undefined
    is_archive?: boolean,


}


export interface IEmployeeOption {
    value: number;
    label: string;
  }