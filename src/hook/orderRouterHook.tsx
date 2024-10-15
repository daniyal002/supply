import { IErrorResponse } from "@/interface/error";
import { IOrderItem } from "@/interface/orderItem";
import { IAddRouterRequest, IOrderRouteDeleteRequest, IOrderRouteResponse, IOrderRouteResponseDetail } from "@/interface/orderRoute";
import { orderRouteService } from "@/services/orderRouter.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";



export const useOrderRouteData = () => {
    const {
      data: orderRouteData,
      isLoading,
      error,
    } = useQuery({
      queryKey: ["newOrderRoute"],
      queryFn: orderRouteService.getOrderRoute,
    });
    return { orderRouteData, isLoading, error };
  };

  export const useOrderRouteByIdData = (routeId:number) => {
    const {
      data: orderRouteByIdData,
      isLoading,
      error,
    } = useQuery({
      queryKey: ["newOrderRouteById"],
      queryFn: () => orderRouteService.getOrderRouteById(routeId),
    });
    return { orderRouteByIdData, isLoading, error };
  };

export const useCreateOrderRouteMutation = () => {
    const queryClient = useQueryClient();
	const { replace } = useRouter()

    const { mutate } = useMutation({
      mutationKey: ["createOrderRoute"],
      mutationFn: (data: IAddRouterRequest) => orderRouteService.addOrderRoute(data),
      onSuccess: (newOrderRoute,variables) => {
            queryClient.setQueryData(
              ["newOrderRoute"],
              (oldData: IOrderRouteResponseDetail[] | undefined) => {
                if (!oldData) return [];
                return [...oldData, newOrderRoute];
              }
            );
            replace('/i/routes')
      },
      onError(error: AxiosError<IErrorResponse>) {
        message.error(error?.response?.data?.detail);
      },
    });
    return { mutate };
  };

  export const  useUpdateOrderRouteMutation = () => {
    const queryClient = useQueryClient();
    const { replace } = useRouter()
    const { mutate } = useMutation({
      mutationKey: ["updateOrderRoute"],
      mutationFn: (data: IAddRouterRequest) => orderRouteService.updateOrderRoute(data),
      onSuccess: (newOrderRoute,variables) => {
        queryClient.setQueryData(
          ["newOrderRoute"],
          (oldData: IOrderRouteResponseDetail[] | undefined) => {
            if (!oldData) return [];
            return oldData.map(orderRoute =>  orderRoute.route_id === variables.route_id ? newOrderRoute : orderRoute);

          }
        )
        replace('/i/routes')
  },
  })
  return {mutate}
};


  export const useDeleteOrderRouteMutation = () => {
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
      mutationKey: ["deleteOrderRoute"],
      mutationFn: (data:IOrderRouteDeleteRequest) => orderRouteService.deleteOrderRoute(data),
      onSuccess: (newOrder,variables) => {
          queryClient.setQueryData(
            ["newOrderRoute"],
            (oldData: IOrderRouteResponseDetail[] | undefined) => {
              if (!oldData) return [];
              return oldData.filter((orderRoute) => orderRoute.route_id !== variables.route_id);
            }
          );
      },
      onError(error: AxiosError<IErrorResponse>) {
        message.error(error?.response?.data?.detail);
        console.log(error?.response?.data)
      },
    });
    return { mutate };
  };