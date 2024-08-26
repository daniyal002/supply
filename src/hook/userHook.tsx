import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { IUser } from "@/interface/user";
import { message } from "antd";
import axios, { AxiosError } from "axios";
import { IErrorResponse } from "@/interface/error";
import { getAccessToken } from "@/services/auth-token.service";
import { tree } from "next/dist/build/templates/app-page";

export const useUserData = () => {
  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["Users"],
    queryFn: userService.getUser,
    staleTime: Infinity,
  });
  return { userData, isLoading, error };
};

export const useGetMe = () => {
  const {
    data: GetMeData,
    isLoading,
    error,
  } = useQuery({ queryKey: ["getMe"], queryFn: () => userService.getMe(),
    // staleTime: Infinity,
   });
  return { GetMeData, isLoading, error };
};

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();
  const { mutate, error } = useMutation({
    mutationKey: ["createUser"],
    mutationFn: (data: IUser) =>
      userService.addUser({
        login: data.login,
        password: data.password,
        employee_id: data.employee.buyer_id as number,
        role_id: data.role?.role_id as number,
      }),
    onSuccess: (newUser) => {
      queryClient.setQueryData(["Users"], (oldData: IUser[] | undefined) => {
        if (!oldData) return [];
        return [...oldData, newUser.user];
      });
    },
    onError(error: AxiosError<IErrorResponse>) {
      message.error(error?.response?.data?.detail);
    },
  });
  return { mutate, error };
};

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationKey: ["updateUser"],
    mutationFn: (data: IUser) =>
      userService.updateUser({
        user_id: data.user_id,
        login: data.login,
        password: data.password,
        employee_id: data.employee.buyer_id as number,
        role_id: data.role?.role_id as number,
      }),
    onSuccess: (updatedEmployee, variables) => {
      queryClient.setQueryData(["Users"], (oldData: IUser[] | undefined) => {
        if (!oldData) return [];
        return oldData.map((users) =>
          users.user_id === variables.user_id ? variables : users
        );
      });
    },
    onError(error: AxiosError<IErrorResponse>) {
      message.error(error?.response?.data?.detail);
    },
  });
  return { mutate };
};

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationKey: ["deleteUser"],
    mutationFn: (data: IUser) =>
      userService.deleteUserById({
        user_id: data.user_id,
        login: data.login,
        password: data.password,
        employee_id: data.employee.buyer_id as number,
        role_id: data.role?.role_id as number,
      }),
    onSuccess: (updatedEmployee, variables) => {
      queryClient.setQueryData(["Users"], (oldData: IUser[] | undefined) => {
        if (!oldData) return [];
        return oldData.filter((users) => users.user_id !== variables.user_id);
      });
    },
    onError(error: AxiosError<IErrorResponse>) {
      message.error(error?.response?.data?.detail);
    },
  });
  return { mutate };
};
