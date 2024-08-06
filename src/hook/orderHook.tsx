import { IErrorResponse } from "@/interface/error";
import { IOrderItemRequest } from "@/interface/orderItem";
import { orderService } from "@/services/order.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import axios, { AxiosError } from "axios";


export const useGetOrderById = (id:string) => {
  const {
    data: getOrderByIdData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["getOrderById"],
    queryFn: () => orderService.getOrderById(id),
  });
  return { getOrderByIdData, isLoading, error };
};
export const useOrderUserData = () => {
  const {
    data: orderUserData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["OrderUser"],
    queryFn: orderService.getUserOrder,
    staleTime: Infinity,
  });
  return { orderUserData, isLoading, error };
};

export const useCreateOrderMutation = () => {
    const queryClient = useQueryClient();
  
      const {mutate} = useMutation({
          mutationKey:['createOrder'],
          mutationFn:(data:IOrderItemRequest) => orderService.addOrder(data),
          onSuccess: (newEmployee) => {
        //     queryClient.setQueryData(
        //       ["Employees"],
        //       (oldData: IEmployee[] | undefined) => {
        //         if (!oldData) return [];
        //         return [...oldData, newEmployee.employee];
        //       }
        //     );
          },
          onError(error:AxiosError<IErrorResponse>){
            message.error(error?.response?.data?.detail)
          }    
      })
        return {mutate}
  };