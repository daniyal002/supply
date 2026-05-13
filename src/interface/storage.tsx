export interface IStorage {
  storage_id: number;
  storage_name: string;
  storage_1c_code: string;
  oms: boolean;
  is_archive:boolean
  note?: string;
}

export interface IStorageResponse {
  detail: IStorage[];
}

export interface IStorageResponseItem {
  detail: IStorage;
}

export interface IStorageOption {
  value: number;
  label: string;
}

export interface IStorageRequest {
  storage_id: number;
  storage_name: string;
  storage_1c_code: string;
  oms: boolean;
  note?: string;
}

export type IStorageCreateRequest = Omit<IStorageRequest, "storage_id">;
export type IStorageIdOnly = Pick<IStorageRequest, "storage_id">;