import { IDepartment } from "./department"
import { EnumOrderTypes } from "./orderItem"
import { IOrderRouteStepRequest, IOrderRouteStepResponse } from "./orderRouteStep"

export interface IOrderRouteRequest{
    route_id?:number
    route_name:string
    department_id:number
    order_route_type: EnumOrderTypes.PURCHASE | EnumOrderTypes.WAREHOUSE
}

export interface IOrderRouteResponse{
    detail:IOrderRouteResponseDetail[]
}

export interface IOrderRouteResponseDetail{
    route_id?:number
    route_name:string
    department?:IDepartment
    order_route_type: EnumOrderTypes.PURCHASE | EnumOrderTypes.WAREHOUSE
    is_archive?: boolean,
}

export interface IAddRouterRequest {
    route_id?:number;
    route_name: string;
    department_id: number;
    order_route_type: EnumOrderTypes.PURCHASE | EnumOrderTypes.WAREHOUSE
    steps: IOrderRouteStepRequest[]
    is_archive?: boolean,
}

export  interface IOrderRouteByIdResponse {
    detail:{
        route_id?:number
        route_name:string
        department?:IDepartment
        order_route_type: EnumOrderTypes.PURCHASE | EnumOrderTypes.WAREHOUSE
        steps:IOrderRouteStepResponse[]
    }
}

export interface IOrderRouteDeleteRequest{
    route_id:number,
    route_name:string,
}