import { IDepartment } from "./department"
import { IOrderRouteStepRequest } from "./orderRouteStep"

export interface IOrderRouteRequest{
    route_id?:number
    route_name:string
    department_id:number
}

export interface IOrderRouteResponse{
    route_id?:number
    route_name:string
    department_id?:IDepartment
}

export interface IAddRouterRequest {
    route_name: string;
    department_id: number;
    steps: IOrderRouteStepRequest[]
}
