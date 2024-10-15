import { IDepartment } from "./department"
import { IOrderRouteStepRequest, IOrderRouteStepResponse } from "./orderRouteStep"

export interface IOrderRouteRequest{
    route_id?:number
    route_name:string
    department_id:number
}

export interface IOrderRouteResponse{
    detail:IOrderRouteResponseDetail[]
}

export interface IOrderRouteResponseDetail{
    route_id?:number
    route_name:string
    department?:IDepartment
}

export interface IAddRouterRequest {
    route_id?:number;
    route_name: string;
    department_id: number;
    steps: IOrderRouteStepRequest[]
}

export  interface IOrderRouteByIdResponse {
    detail:{
        route_id?:number
        route_name:string
        department?:IDepartment
        steps:IOrderRouteStepResponse[]
    }
}

export interface IOrderRouteDeleteRequest{
    route_id:number,
    route_name:string,
}