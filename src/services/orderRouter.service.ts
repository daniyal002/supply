import { axiosWidthAuth } from "@/api/interseptors";
import { IOrderItemRequestDelete } from "@/interface/orderItem";
import {
  IAddRouterRequest,
  IOrderRouteByIdResponse,
  IOrderRouteDeleteRequest,
  IOrderRouteResponse,
  IOrderRouteResponseDetail,
} from "@/interface/orderRoute";

export const orderRouteService = {
  async getOrderRoute() {
    const response = await axiosWidthAuth.get<IOrderRouteResponse>(
      "route/get_route"
    );
    return response.data.detail;
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

  async updateOrderRoute(data: IAddRouterRequest){
    const response = await axiosWidthAuth.put<IOrderRouteResponseDetail>('route/update_route',data)
    return response.data
  },

  async deleteOrderRoute(data:IOrderRouteDeleteRequest){
    if (!isNaN(Number(data.route_id)) && Number(data.route_id) > 0) {
      const response = await axiosWidthAuth.delete<string>(
        "route/delete_order_route",{data}
        );
        return response.data
  }
  }
};
