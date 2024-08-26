export interface IFloor{
    floor_id?:number,
    floor_name:string
}

export interface IFloorRespone{
    detail:IFloor[]
}

export interface IFloorOption {
    value: number;
    label: string;
  }