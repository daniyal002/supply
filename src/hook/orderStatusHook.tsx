import { IErrorResponse } from "@/interface/error";
import { IOrderStatus } from "@/interface/orderStatus";
import { orderStatusService } from "@/services/orderStatus.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import axios, { AxiosError } from "axios";


export const useGetOrderStatus = () => {
  const {
    data: orderStatusData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["orderStatus"],
    queryFn: orderStatusService.getStatus,
    staleTime: Infinity,
  });

  return { orderStatusData, isLoading, error, refetch };
};

export const useCreateOrderStatusMutation = () => {
  const queryClient = useQueryClient();

  const {mutate, isPending } = useMutation({
    mutationKey: ["createOrderStatus"],
    mutationFn: (data: IOrderStatus) => orderStatusService.addStatus(data),
    onSuccess(newStatus) {
      queryClient.setQueryData(
        ["orderStatus"],
        (oldData: IOrderStatus[] | undefined) => {
          if (!oldData) return [];
          return [...oldData, newStatus];
        }
      );
    },
    onError(error: AxiosError<IErrorResponse>) {
        message.error(error?.response?.data?.detail);
      },
  });

  return {mutate,isPending}
};

export const useUpdateOrderStatusMutation = () => {
    const queryClient = useQueryClient();

    const {mutate, isPending } = useMutation({
      mutationKey: ["updateOrderStatus"],
      mutationFn: (data: IOrderStatus) => orderStatusService.updateStatus(data),
      onSuccess(newStatus,variables) {
        queryClient.setQueryData(
          ["orderStatus"],
          (oldData: IOrderStatus[] | undefined) => {
            if (!oldData) return [];
            return oldData.map((status) => status.status_id === variables.status_id ? {...variables, is_archive:false} : status  )
          }
        );
      },
      onError(error: AxiosError<IErrorResponse>) {
          message.error(error?.response?.data?.detail);
        },
    });

    return {mutate,isPending}
  };

export const useDeleteOrderStatusMutation = () => {
    const queryClient = useQueryClient();

    const {mutate, isPending } = useMutation({
      mutationKey: ["deleteOrderStatus"],
      mutationFn: (data: {status_id: number}) => orderStatusService.deleteStatusById(data),
      onSuccess(_,variables) {
        queryClient.setQueryData(
          ["orderStatus"],
          (oldData: IOrderStatus[] | undefined) => {
            if (!oldData) return [];
            return oldData.filter((status) => status.status_id !== variables.status_id);
          }
        );
      },
      onError(error: AxiosError<IErrorResponse>) {
          message.error(error?.response?.data?.detail);
        },
    });

    return {mutate,isPending}
  };
