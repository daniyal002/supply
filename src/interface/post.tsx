export interface IPost{
    post_id?:number,
    post_name:string
    is_archive?: boolean,

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