import { IErrorResponse } from "@/interface/error";
import { IOrderItem } from "@/interface/orderItem";
import { IAddRouterRequest, IOrderRouteResponse, IOrderRouteResponseDetail } from "@/interface/orderRoute";
import { orderRouteService } from "@/services/orderRouter.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import axios, { AxiosError } from "axios";
// import { useRouter } from "next/router";



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
	// const { replace } = useRouter()

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
            // replace('i/routes')
      },
      onError(error: AxiosError<IErrorResponse>) {
        message.error(error?.response?.data?.detail);
      },
    });
    return { mutate };
  };