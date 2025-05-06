export interface IStorage {
    storage_id:number;
    storage_name: string;
    storage_1c_code:string;
    oms:boolean;
}

export interface IStorageResponse{
    detail:IStorage[]
}

export interface IStorageOption {
    value: number;
    label: string;
  }