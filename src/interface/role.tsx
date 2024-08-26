export interface IRole{
    role_id?:number,
    role_name:string
}

export interface IRoleResponse{
    detail:IRole[]
}

export interface IRoleAddResponse{
    detail:string,
    role: IRole
}

export interface IRoleOption {
    value: number;
    label: string;
  }