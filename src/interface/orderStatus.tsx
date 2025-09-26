export interface IOrderStatus {
  status_id?: number;
  status_name: string;
  status_color: string;
  status_type: EnumStatusType.UNF | EnumStatusType.SNAB;
  is_archive: boolean;
  note: string;
}

export interface IOrderStatusResponse {
    detail:IOrderStatus[]
}

export interface IOrderStatusCreateResponse{
    detail:IOrderStatus
}

export enum EnumStatusType{
  "UNF" = 'unf',
  "SNAB" = 'snab'
}