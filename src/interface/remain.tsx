export interface IRemain {
  storage_name: string;
  remain_quantity: number;
  unit_measurement_name: string;
}

export interface IRemainByIdResponse {
  detail: IRemain[];
}
