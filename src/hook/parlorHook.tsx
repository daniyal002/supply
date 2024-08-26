import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { parlorService } from "@/services/parlor.service";
import { IParlor } from "@/interface/parlor";
import { IErrorResponse } from "@/interface/error";
import axios, { AxiosError } from "axios";
import { message } from "antd";

export const useParlorData = () => {
  const {
    data: parlorData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["Parlors"],
    queryFn: parlorService.getParlor,
    staleTime: Infinity,
  });
  return { parlorData, isLoading, error };
};

export const useCreateParlorMutation = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["createParlor"],
    mutationFn: (data: IParlor) =>
      parlorService.addParlor({
        parlor_name: data.parlor_name,
        department_id: data.department?.department_id as number,
        floor_id: data.floor?.floor_id as number,
      }),
    onSuccess: (newParlor) => {
      queryClient.setQueryData(
        ["Parlors"],
        (oldData: IParlor[] | undefined) => {
          if (!oldData) return [];
          return [...oldData, newParlor.parlor];
        }
      );
    },
    onError(error: AxiosError<IErrorResponse>) {
      message.error(error?.response?.data?.detail);
    },
  });
  return { mutate };
};

export const useUpdateParlorMutation = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["updateParlor"],
    mutationFn: (data: IParlor) =>
      parlorService.updateParlor({
        parlor_id: data.parlor_id,
        parlor_name: data.parlor_name,
        department_id: data.department?.department_id as number,
        floor_id: data.floor?.floor_id as number,
      }),
    onSuccess: (updatedParlor, variables) => {
      queryClient.setQueryData(
        ["Parlors"],
        (oldData: IParlor[] | undefined) => {
          if (!oldData) return [];
          return oldData.map((parlor) =>
            parlor.parlor_id === variables.parlor_id ? variables : parlor
          );
        }
      );
    },
    onError(error: AxiosError<IErrorResponse>) {
      message.error(error?.response?.data?.detail);
    },
  });
  return { mutate };
};

export const useDeleteParlorMutation = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["deleteParlor"],
    mutationFn: (data: IParlor) =>
      parlorService.deleteParlorById({
        parlor_id: data.parlor_id,
        parlor_name: data.parlor_name,
        department_id: data.department?.department_id as number,
        floor_id: data.floor?.floor_id as number,
      }),
    onSuccess: (updatedParlor, variables) => {
      queryClient.setQueryData(
        ["Parlors"],
        (oldData: IParlor[] | undefined) => {
          if (!oldData) return [];
          return oldData.filter((parlor) => parlor.parlor_id !== variables.parlor_id);
        }
      );
    },
    onError(error: AxiosError<IErrorResponse>) {
      message.error(error?.response?.data?.detail);
    },
  });
  return { mutate };
};
