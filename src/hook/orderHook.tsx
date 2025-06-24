import { IErrorResponse } from "@/interface/error";
import {
  IOrderItem,
  IOrderItemRequest,
  IOrderItemRequestDelete,
  IOrderTo1CRequest,
} from "@/interface/orderItem";
import { orderService } from "@/services/order.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import axios, { AxiosError } from "axios";
import { useOrderIdStore } from "../../store/orderIdStore";
import { useEffect } from "react";
import {
  IOrderAddProductCancelCommentRequest,
  IOrderDeleteProductCancelCommentRequest,
  IOrderProductCommentsRequest,
} from "@/interface/orderProductComments";

export const useGetOrderById = (id: string) => {
  const queryClient = useQueryClient();

  const {
    data: getOrderByIdData,
    isLoading,
    error,
    isRefetching,
  } = useQuery({
    queryKey: ["getOrderById", id],
    queryFn: () => orderService.getOrderById(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (isRefetching) {
      queryClient.invalidateQueries({ queryKey: ["OrderStepHistory"] });
      queryClient.invalidateQueries({ queryKey: ["OrderRouteSteps"] });
    }
  }, [isRefetching]);

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

export const useOrdersData = () => {
  const {
    data: ordersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["Orders"],
    queryFn: orderService.getOrders,
    // staleTime: Infinity,
  });
  return { ordersData, isLoading, error };
};

export const useApprovalOrders = () => {
  const {
    data: approvalOrders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["approvalOrders"],
    queryFn: orderService.getApprovalOrders,
  });
  return { approvalOrders, isLoading, error };
};

export const useOderStatusData = () => {
  const {
    data: oderStatusData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["OrderStatus"],
    queryFn: orderService.getOrderStatus,
  });
  return { oderStatusData, isLoading, error };
};

export const useOrderStepHistory = (order_id: number) => {
  const {
    data: orderStepHistory,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["OrderStepHistory"],
    queryFn: () => orderService.getOrderStepHistory(order_id),
  });
  return { orderStepHistory, isLoading, error };
};

export const useOrderRouteSteps = (order_id: number) => {
  const {
    data: orderRouteSteps,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["OrderRouteSteps"],
    queryFn: () => orderService.getOrderRouteSteps(order_id),
  });
  return { orderRouteSteps, isLoading, error };
};

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();
  const setDraftNewOrderId = useOrderIdStore((state) => state.setDraftNewOrderId);
  const setDraftOrderId = useOrderIdStore((state) => state.setDraftOrderId);

  const { mutate, isPending } = useMutation({
    mutationKey: ["createOrder"],
    mutationFn: (data: IOrderItemRequest) => orderService.addOrder(data),
    onSuccess: (newOrder, variables) => {
      setDraftNewOrderId("0"),
      setDraftOrderId("0"),
        queryClient.setQueryData(
          ["OrderUser"],
          (oldData: IOrderItem[] | undefined) => {
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

export const useUpdateOrderMutation = () => {
  const queryClient = useQueryClient();
  const setOrderId = useOrderIdStore((state) => state.setOrderId);

  const { mutate, isPending } = useMutation({
    mutationKey: ["updateOrder"],
    mutationFn: (data: IOrderItemRequest) => orderService.updateOrder(data),
    onSuccess: (newOrder, variables) => {
      // queryClient.invalidateQueries({queryKey:['OrderUser']})
      setOrderId("0");
      queryClient.setQueryData(
        ["OrderUser"],
        (oldData: IOrderItem[] | undefined) => {
          if (!oldData) return [];
          return oldData.map((order) => {
            if (order.order_id === variables.order_id) {
              return newOrder.order;
            }
            return order;
          });
        }
      );
      message.success("Заявка успешно обновлена !");
    },
    onError(error: AxiosError<IErrorResponse>) {
      message.error(error?.response?.data?.detail);
    },
  });
  return { mutate, isPending };
};

export const useAgreedOrderMutation = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isSuccess } = useMutation({
    mutationKey: ["agreedOrder"],
    mutationFn: (data: { order_id: number; note: string }) =>
      orderService.agreedOrder(data.order_id, data.note),
    onSuccess: (agreedOrder, variables) => {
      queryClient.setQueryData(
        ["approvalOrders"],
        (oldData: IOrderItem[] | undefined) => {
          if (!oldData) return [];
          return oldData.filter(
            (order) => order.order_id !== variables.order_id
          );
        }
      );
      message.success("Заявка успешно согласована !");
    },
    onError(error: AxiosError<IErrorResponse>) {
      message.error(error?.response?.data?.detail);
    },
  });
  return { mutate, isPending, isSuccess };
};

export const useRejectOrderMutation = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isSuccess } = useMutation({
    mutationKey: ["rejectOrder"],
    mutationFn: (data: { order_id: number; note: string }) =>
      orderService.rejectOrder(data.order_id, data.note),
    onSuccess: (rejectOrder, variables) => {
      queryClient.setQueryData(
        ["approvalOrders"],
        (oldData: IOrderItem[] | undefined) => {
          if (!oldData) return [];
          return oldData.filter(
            (order) => order.order_id !== variables.order_id
          );
        }
      );
      message.success("Заявка успешно отклонена !");
    },
    onError(error: AxiosError<IErrorResponse>) {
      message.error(error?.response?.data?.detail);
    },
  });
  return { mutate, isPending, isSuccess };
};

export const useDeleteOrderMutation = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["deleteOrder"],
    mutationFn: (data: IOrderItemRequestDelete) =>
      orderService.deleteOrderById(data),
    onSuccess: (newOrder, variables) => {
      queryClient.setQueryData(
        ["OrderUser"],
        (oldData: IOrderItem[] | undefined) => {
          if (!oldData) return [];
          return oldData.filter(
            (order) => order.order_id !== variables.order_id
          );
        }
      );
      message.success("Заявка успешно удалена !");
    },
    onError(error: AxiosError<IErrorResponse>) {
      message.error(error?.response?.data?.detail);
    },
  });
  return { mutate };
};

export const useResetOrderMutation = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["resetOrder"],
    mutationFn: (order_id: number) => orderService.resetOrder(order_id),
    onSuccess: (newOrder, variables) => {
      queryClient.setQueryData(
        ["OrderUser"],
        (oldData: IOrderItem[] | undefined) => {
          if (!oldData) return [];
          return oldData.map((order) => {
            if (order.order_id === variables) {
              return newOrder.order; // Предполагается, что newOrder содержит обновленный заказ
            }
            return order;
          });
        }
      );
      message.success("Заявка успешно сброшена !");
    },
    onError(error: AxiosError<IErrorResponse>) {
      message.error(error?.response?.data?.detail);
    },
  });

  return { mutate };
};

export const useAddOrderProductCommentMutation = (orderId: number) => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["addOrderProductComment"],
    mutationFn: (data: IOrderProductCommentsRequest) =>
      orderService.addOrderProductComment(data),
    onSuccess: (newComment, variables) => {
      queryClient.setQueryData(
        ["getOrderById", String(orderId)], // Ключ должен быть строкой
        (oldData: IOrderItem | undefined) => {
          // Исправлен тип на объект
          if (!oldData) return oldData;

          // Обновляем массив продуктов
          const updatedProducts = oldData.order_products?.map((product) =>
            product.order_product_id === variables.order_product_id
              ? {
                  ...product,
                  order_product_comment: [
                    newComment.detail, // Добавляем новый комментарий
                    ...(product.order_product_comment || []),
                  ],
                }
              : product
          );
          // Возвращаем обновленный заказ
          return {
            ...oldData,
            order_products: updatedProducts,
          };
        }
      );

      message.success("Комментарий успешно добавлен!");
    },
    onError(error: AxiosError<IErrorResponse>) {
      message.error(error?.response?.data?.detail);
    },
  });

  return { mutate };
};

export const useDeleteOrderProductCommentMutation = (orderId: number) => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["deleteOrderProductComment"],
    mutationFn: (data: { comment_id: number }) =>
      orderService.deleteOrderProductComment(data),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(
        ["getOrderById", String(orderId)], // Ключ должен быть строкой
        (oldData: IOrderItem | undefined) => {
          // Исправлен тип на объект
          if (!oldData) return oldData;
          // Обновляем массив продуктов
          const updatedProducts = oldData.order_products?.map((product) => {
            return {
              ...product,
              order_product_comment: product.order_product_comment?.filter(
                (pc) => pc.comment_id !== variables.comment_id
              ),
            };
          });

          // Возвращаем обновленный заказ
          return {
            ...oldData,
            order_products: updatedProducts,
          };
        }
      );

      message.success("Комментарий успешно удален!");
    },
    onError(error: AxiosError<IErrorResponse>) {
      message.error(error?.response?.data?.detail);
    },
  });

  return { mutate };
};

export const useAddOrderProductCancelCommentMutation = (orderId: number) => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["addOrderProductCancelComment"],
    mutationFn: (data: IOrderAddProductCancelCommentRequest) =>
      orderService.addOrderProductCancelComment(data),
    onSuccess(data, variables) {
      queryClient.setQueryData(
        ["getOrderById", String(orderId)], // Ключ должен быть строкой
        (oldData: IOrderItem | undefined) => {
          // Исправлен тип на объект
          if (!oldData) return oldData;
          const updatedProducts = oldData.order_products?.map(
            (product) =>
              product.order_product_id === variables.order_product_id
                ? {
                    ...product,
                    is_cancel: true,
                    order_cancel_comment: data.detail,
                  } // Update the matching product
                : product // Keep other products unchanged
          );

          return {
            ...oldData,
            order_products: updatedProducts,
          };
        }
      );

      message.success("Вы успешно отклонили позицию.");
    },
    onError(error: AxiosError<IErrorResponse>) {
      message.error(error?.response?.data?.detail);
    },
  });

  return { mutate };
};

export const useDeleteOrderProductCancelCommentMutation = (orderId: number) => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["deleteOrderProductCancelComment"],
    mutationFn: (data: IOrderDeleteProductCancelCommentRequest) =>
      orderService.deleteOrderProductCancelComment(data),
    onSuccess(_, variables) {
      queryClient.setQueryData(
        ["getOrderById", String(orderId)], // Ключ должен быть строкой
        (oldData: IOrderItem | undefined) => {
          // Исправлен тип на объект
          if (!oldData) return oldData;
          const updatedProducts = oldData.order_products?.map(
            (product) =>
              product.order_product_id === variables.order_product_id
                ? { ...product, is_cancel: false, order_cancel_comment: {} } // Update the matching product
                : product // Keep other products unchanged
          );

          return {
            ...oldData,
            order_products: updatedProducts,
          };
        }
      );

      message.success("Вы успешно активировали позицию.");
    },
    onError(error: AxiosError<IErrorResponse>) {
      message.error(error?.response?.data?.detail);
    },
  });

  return { mutate };
};

export const useForceSubmitOrderTo1cMutation = () => {
  const { mutate } = useMutation({
    mutationKey: ["forceSubmitOrderTo1c"],
    mutationFn: (data: IOrderTo1CRequest) =>
      orderService.forceSubmitOrderTo1c(data),
    onSuccess() {
      message.success("Вы успешно отправили заявку в 1С УНФ.");
    },
    onError(error: AxiosError<IErrorResponse>) {
      message.error(error?.response?.data?.detail);
    },
  });

  return { mutate };
};
