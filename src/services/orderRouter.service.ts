import { axiosWidthAuth } from "@/api/interseptors";
import {
  IAddRouterRequest,
  IOrderRouteByIdResponse,
  IOrderRouteResponse,
  IOrderRouteResponseDetail,
} from "@/interface/orderRoute";

export const orderRouteService = {
  async getOrderRoute() {
    const response = await axiosWidthAuth.get<IOrderRouteResponse>(
      "route/get_route"
    );
    return response.data;
  },

  async getOrderRouteById(routeId: number) {
    if (!isNaN(Number(routeId)) && Number(routeId) > 0) {
      const response = await axiosWidthAuth.get<IOrderRouteByIdResponse>(
        `route/get_route_by_id?route_id=${routeId}`
      );
      return response.data.detail;
    }
  },
  async addOrderRoute(data: IAddRouterRequest) {
    const response = await axiosWidthAuth.post<IOrderRouteResponseDetail>(
      "route/add_route",
      data
    );
    return response.data;
  },
};
