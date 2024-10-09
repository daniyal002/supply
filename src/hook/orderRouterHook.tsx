import { IErrorResponse } from "@/interface/error";
import { IAddRouterRequest, IOrderRouteResponse } from "@/interface/orderRoute";
import { orderRouteService } from "@/services/orderRouter.service";
import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import axios, { AxiosError } from "axios";

export const useCreateOrderRouteMutation = () => {
    // const queryClient = useQueryClient();

    const { mutate } = useMutation({
      mutationKey: ["createOrderRoute"],
      mutationFn: (data: IAddRouterRequest) => orderRouteService.addOrderRoute(data),
      onSuccess: (newOrder,variables) => {
            // queryClient.setQueryData(
            //   ["OrderUser"],
            //   (oldData: IOrderItem[] | undefined) => {
            //     console.log(oldData)
            //     console.log(newOrder)
            //     if (!oldData) return [];
            //     return [...oldData, newOrder.order];
            //   }
            // );
      },
      onError(error: AxiosError<IErrorResponse>) {
        message.error(error?.response?.data?.detail);
      },
    });
    return { mutate };
  };