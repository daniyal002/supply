import { axiosWidthAuth } from "@/api/interseptors";
import { IAddRouterRequest, IOrderRouteResponse } from "@/interface/orderRoute";

export const orderRouteService = {
    async addOrderRoute(data:IAddRouterRequest) {
        const response = await axiosWidthAuth.post<IOrderRouteResponse>("router/add_route",data)
        return response.data
    }
}