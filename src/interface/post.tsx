export interface IPost{
    id?:number,
    post_name:string
}

export interface IPostResponse{
    detail:IPost[]
}

export interface IPostAddResponse{
    detail:string,
    post: IPost
}

export interface IPostOption {
    value: number;
    label: string;
  }