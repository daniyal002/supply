export interface ILoginRequest{
    login:string,
    password:string
}

export interface ILoginResponse{
    access_token:string,
    refresh_token:string,
    detail?:string,
}

export interface IRegisterRequest{
    login:string,
    password:string,
}

export interface IRegisterResponse{
    message:string;
}

export interface IRefreshRequest{
    refresh_token:string
}