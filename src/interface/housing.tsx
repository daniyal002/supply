export interface IHousing{
    id?:number,
    housing_name:string
}

export interface IHousingResponse{
    detail?:IHousing[]
}

export interface IHousingAddResponse{
    detail:string,
    housing: IHousing
}