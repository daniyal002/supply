import { IChangePasswordRequest, ILoginRequest } from "@/interface/auth";
import { authService } from "@/services/auth.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { IErrorResponse } from "@/interface/error";
import { useRouter } from "next/navigation";
import { useHeaderStore } from "../../store/headerStore";
import { useTabStore } from "../../store/tabStore";
import { message } from "antd";
import { initWebSocket } from "./useWebSocket";


export const useLogin = () => {
  const { replace } = useRouter();
  const setLogin = useHeaderStore((state) => state.setLogin);
  const queryClient = useQueryClient(); // нужен для WebSocket

  const { mutate, isSuccess, error } = useMutation({
    mutationKey: ["login"],
    mutationFn: (data: ILoginRequest) => authService.login(data),
    onSuccess(data, variables) {
      initWebSocket(queryClient);
      setLogin(variables.login);
      replace("/");

    },
    onError(error: AxiosError<IErrorResponse>) {
      // alert(error)
      // console.log(error)
    },
  });

  return { mutate, isSuccess, error };
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { replace } = useRouter();
  const { deleteTabsApproval, deleteTabsOrders } = useTabStore();

  const { mutate, isSuccess, error } = useMutation({
    mutationKey: ["logout"],
    mutationFn: () => authService.logout(),
    onSuccess: async () => {
      // Очищаем состояния
      deleteTabsApproval();
      deleteTabsOrders();

      // Очищаем все кэши React Query
      await queryClient.resetQueries();
      queryClient.clear();

      // Редиректим на страницу логина
      replace("/login");
    },
    onError(error: AxiosError<IErrorResponse>) {
      message.error(error?.response?.data?.detail);
    },
  });

  return { mutate, isSuccess, error };
};

export const useChangePassword = () => {
  const queryClient = useQueryClient();
  const { replace } = useRouter();

  const { mutate, isSuccess, error } = useMutation({
    mutationKey: ["changePassword"],
    mutationFn: (data:IChangePasswordRequest) => authService.changePassword(data),
    onSuccess: async () => {
      // Очищаем все кэши React Query
      await queryClient.resetQueries();
      queryClient.clear();

      // Редиректим на страницу логина
      replace("/login");
    },
    onError(error: AxiosError<IErrorResponse>) {
      message.error(error?.response?.data?.detail);
    },
  });

  return { mutate, isSuccess, error };
};
