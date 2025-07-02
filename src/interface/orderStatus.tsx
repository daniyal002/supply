export interface IOrderStatus {
  status_id?: number;
  status_name: string;
  status_color: string;
  note: string;
}

export interface IOrderStatusResponse {
    detail:IOrderStatus[]
}

export interface IOrderStatusCreateResponse{
    detail:IOrderStatus
}