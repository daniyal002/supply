import { IErrorResponse } from "@/interface/error";
import { IDraftOrderItem, IDraftOrderItemRequest, IOrderDrafttemRequestDelete, IOrderItem, IOrderItemRequest } from "@/interface/orderItem";
import { orderTempService } from "@/services/orderTemp.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { AxiosError } from "axios";



export const useDraftOrderUserData = () => {
    const {
      data: draftOrderUserData,
      isLoading,
      error,
      refetch
    } = useQuery({
      queryKey: ["DraftOrderUser"],
      queryFn: orderTempService.getUserTempOrder,
      // staleTime: Infinity,
    });
    return { draftOrderUserData, isLoading, error, refetch };
  };

  export const useGetOrderDraftById = (id: string) => {

    const {
      data: getOrderByIdData,
      isLoading,
      error,
    } = useQuery({
      queryKey: ["getOrderById", id],
      queryFn: () => orderTempService.getOrderTempById(id),
      enabled: !!id,
    });



    return { getOrderByIdData, isLoading, error };
  };

export const useSaveDraftOrderMutation = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
      mutationKey: ["saveDraftOrder"],
      mutationFn: (data: IDraftOrderItemRequest) => orderTempService.saveOrder(data),
      onSuccess: (newOrder, variables) => {
          queryClient.setQueryData(
            ["DraftOrderUser"],
            (oldData: IDraftOrderItem[] | undefined) => {
              if (!oldData) return [];
              return [...oldData, newOrder.order];
            }
          );
        message.success(newOrder.detail);
      },
      onError(error: AxiosError<IErrorResponse>) {
        message.error(error?.response?.data?.detail);
      },
    });
    return { mutate, isPending };
  };

export const useUpdateDraftOrderMutation = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["UpdateDraftOrder"],
    mutationFn: (data: IDraftOrderItemRequest) => orderTempService.updateOrder(data),
    onSuccess: (newOrder, variables) => {
      queryClient.setQueryData(
        ["DraftOrderUser"],
        (oldData: IDraftOrderItem[] | undefined) => {
          if (!oldData) return [];
          return oldData.map((order) => {
            if (order.order_temp_id === variables.order_temp_id) {
              return newOrder.order;
            }
            return order;
          });
        }
      );
      message.success("Черновик успешно обновлен !");
    },
    onError(error: AxiosError<IErrorResponse>) {
      message.error(error?.response?.data?.detail);
    },
  });
  return { mutate, isPending };
};

export const useDeleteDraftOrderByIdMutation = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
      mutationKey: ["deleteDraftOrder"],
      mutationFn: (data: IOrderDrafttemRequestDelete) => orderTempService.deleteTempOrderById(data),
      onSuccess: (newOrder, variables) => {
        queryClient.setQueryData(
          ["DraftOrderUser"],
          (oldData: IDraftOrderItem[] | undefined) => {
            if (!oldData) return [];
            return oldData.filter(
              (order) => order.order_temp_id  !== variables.order_temp_id
            );
          }
        );
        message.success("Черновик успешно удален !");
      },
      onError(error: AxiosError<IErrorResponse>) {
        message.error(error?.response?.data?.detail);
      },
    });
    return { mutate, isPending };
  };


  export const useDeleteDraftOrderAllMutation = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
      mutationKey: ["deleteDraftOrder"],
      mutationFn: orderTempService.deleteTempOrderAll,
      onSuccess: () => {
        queryClient.setQueryData(
          ["DraftOrderUser"],
          (oldData: IDraftOrderItem[] | undefined) => {
            if (!oldData) return [];
            return []
          }
        );
        message.success("Все черновики успешно удалены !");
      },
      onError(error: AxiosError<IErrorResponse>) {
        message.error(error?.response?.data?.detail);
      },
    });
    return { mutate, isPending };
  };
