import { IErrorResponse } from "@/interface/error";
import { IOrderItem, IOrderItemRequest, IOrderItemRequestDelete } from "@/interface/orderItem";
import { orderService } from "@/services/order.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useOrderIdStore } from "../../store/orderIdStore";

export const useGetOrderById = (id: string) => {
  const {
    data: getOrderByIdData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["getOrderById", id],
    queryFn: () => orderService.getOrderById(id),
    enabled: !!id,
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
    // staleTime: Infinity,
  });
  return { orderUserData, isLoading, error };
};

export const useOderStatusData = () =>{
  const {data:oderStatusData, isLoading, error} = useQuery({
    queryKey: ["OrderStatus"],
    queryFn: orderService.getOrderStatus,
    });
    return {oderStatusData, isLoading, error};
}

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();
  const setDraftOrderId = useOrderIdStore(state => state.setDraftOrderId);

  const { mutate } = useMutation({
    mutationKey: ["createOrder"],
    mutationFn: (data: IOrderItemRequest) => orderService.addOrder(data),
    onSuccess: (newOrder,variables) => {
          setDraftOrderId("0"),
          queryClient.setQueryData(
            ["OrderUser"],
            (oldData: IOrderItem[] | undefined) => {
              console.log(oldData)
              console.log(newOrder)
              if (!oldData) return [];
              return [...oldData, newOrder.order];
            }
          );
    },
    onError(error: AxiosError<IErrorResponse>) {
      message.error(error?.response?.data?.detail);
    },
  });
  return { mutate };
};

export const useUpdateOrderMutation = () => {
  const queryClient = useQueryClient();
  const { replace } = useRouter();
  const setOrderId = useOrderIdStore(state => state.setOrderId)

  const { mutate } = useMutation({
    mutationKey: ["updateOrder"],
    mutationFn: (data: IOrderItemRequest) => orderService.updateOrder(data),
    onSuccess: (newOrder, variables) => {
      queryClient.invalidateQueries({queryKey:['OrderUser']})
      setOrderId("0")
      // queryClient.setQueryData(
      //   ["OrderUser"],
      //   (oldData: IOrderItem[] | undefined) => {
      //     if (!oldData) return [];
      //     return oldData.map((order) => {
      //       if (order.order_id === variables.order_id) {
      //         return newOrder.order;
      //       }
      //       return order;
      //     });
      //   }
      // );
    },
    onError(error: AxiosError<IErrorResponse>) {
      message.error(error?.response?.data?.detail);
    },
  });
  return { mutate };
};

export const useDeleteOrderMutation = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["updateOrder"],
    mutationFn: (data: IOrderItemRequestDelete) => orderService.deleteOrderById(data),
    onSuccess: (newOrder,variables) => {
        queryClient.setQueryData(
          ["OrderUser"],
          (oldData: IOrderItem[] | undefined) => {
            if (!oldData) return [];
            return oldData.filter((order) => order.order_id !== variables.order_id);
          }
        );
    },
    onError(error: AxiosError<IErrorResponse>) {
      message.error(error?.response?.data?.detail);
    },
  });
  return { mutate };
};
