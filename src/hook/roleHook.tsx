import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { roleService } from "@/services/role.service";
import { IRole } from "@/interface/role";
import { IErrorResponse } from "@/interface/error";
import axios, { AxiosError } from "axios";
import { message } from "antd";

export const useRoleData = () => {
  const {
    data: roleData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["Roles"],
    queryFn: roleService.getRole,
    staleTime: Infinity,
  });
  return { roleData, isLoading, error };
};

export const useCreateRoleMutation = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["createRole"],
    mutationFn: (data: IRole) => roleService.addRole(data),
    onSuccess: (newRole) => {
      // Update the specific post in the 'Posts' query cache
      queryClient.setQueryData(["Roles"], (oldData: IRole[] | undefined) => {
        if (!oldData) return [];
        return [...oldData, newRole.role];
      });
    },
    onError(error: AxiosError<IErrorResponse>) {
      message.error(error?.response?.data?.detail);
    },
  });
  return { mutate };
};

export const useUpdateRoleMutation = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["updateRole"],
    mutationFn: (data: IRole) => roleService.updateRole(data),
    onSuccess: (updatedRole, variables) => {
      // Update the specific post in the 'Posts' query cache
      queryClient.setQueryData(["Roles"], (oldData: IRole[] | undefined) => {
        if (!oldData) return [];
        return oldData.map((role) =>
          role.id === variables.id ? variables : role
        );
      });
    },
    onError(error: AxiosError<IErrorResponse>) {
      message.error(error?.response?.data?.detail);
    },
  });
  return { mutate };
};

export const useDeleteRoleMutation = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["deleteRole"],
    mutationFn: (data: IRole) => roleService.deleteRoleById(data),
    onSuccess: (updatedRole, variables) => {
      // Update the specific post in the 'Posts' query cache
      queryClient.setQueryData(["Roles"], (oldData: IRole[] | undefined) => {
        if (!oldData) return [];
        return oldData.filter((role) => role.id !== variables.id);
      });
    },
    onError(error: AxiosError<IErrorResponse>) {
      message.error(error?.response?.data?.detail);
    },
  });
  return { mutate };
};
