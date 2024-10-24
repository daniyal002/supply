export interface IHousing{
    housing_id?:number,
    housing_name:string
}

export interface IHousingResponse{
    detail?:IHousing[]
}

export interface IHousingAddResponse{
    detail:string,
    housing: IHousing
}

export interface HousingOption {
    value: number;
    label: string;
  }