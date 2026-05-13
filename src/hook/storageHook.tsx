import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { storageService } from "@/services/storage.service";
import {
  IStorage,
  IStorageCreateRequest,
  IStorageIdOnly,
  IStorageRequest,
  IStorageResponseItem,
} from "@/interface/storage";
import { IErrorResponse } from "@/interface/error";
import { AxiosError } from "axios";
import { message } from "antd";

export const useStorageData = () => {
  const {
    data: storageData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["Storage"],
    queryFn: storageService.getAllStorage,
    staleTime: Infinity,
  });
  return { storageData, isLoading, error,refetch };
};

export const useCreateStorageMutation = () => {
  const queryClient = useQueryClient();

  const { mutate, error } = useMutation({
    mutationKey: ["createStorage"],
    mutationFn: (data: IStorageCreateRequest) =>
      storageService.addStorage(data),

    onSuccess: (newStorage: IStorageResponseItem) => {
      message.success(`Склад "${newStorage.detail.storage_name}" успешно создан`);

      queryClient.setQueryData(
        ["Storage"],
        (oldData: IStorage[] | undefined) => {
          if (!oldData) return [];
          return [...oldData, newStorage.detail];
        },
      );
    },

    onError(error: AxiosError<IErrorResponse>) {
      message.error(error?.response?.data?.detail);
    },
  });

  return { mutate, error };
};

export const useUpdateStorageMutation = () => {
  const queryClient = useQueryClient();

  const { mutate, error } = useMutation({
    mutationKey: ["updateStorage"],
    mutationFn: (data: IStorageRequest) => storageService.updateStorage(data),

    onSuccess: (_, variables) => {
      message.success(`Склад "${variables.storage_name}" успешно изменен`);

      queryClient.setQueryData(
        ["Storage"],
        (oldData: IStorage[] | undefined) => {
          if (!oldData) return [];

          return oldData.map((storage) =>
            storage.storage_id === variables.storage_id
              ? { ...storage, ...variables }
              : storage,
          );
        },
      );
    },

    onError(error: AxiosError<IErrorResponse>) {
      message.error(error?.response?.data?.detail);
    },
  });

  return { mutate, error };
};

export const useArchiveStorageMutation = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["archiveStorage"],
    mutationFn: (data: IStorageIdOnly) => storageService.archiveStorage(data),

    onSuccess: (_, variables) => {
      message.success(`Склад успешно обновлён`);

      queryClient.setQueryData(
        ["Storage"],
        (oldData: IStorage[] | undefined) => {
          if (!oldData) return [];

          return oldData.map((storage) =>
            storage.storage_id === variables.storage_id
              ? { ...storage, is_archive: !storage.is_archive }
              : storage,
          );
        },
      );
    },

    onError(error: AxiosError<IErrorResponse>) {
      message.error(error?.response?.data?.detail);
    },
  });

  return { mutate };
};

export const useDeleteStorageMutation = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["deleteStorage"],
    mutationFn: (data: IStorageIdOnly) => storageService.deleteStorage(data),

    onSuccess: (_, variables) => {
      message.success(`Склад успешно удалён`);

      queryClient.setQueryData(
        ["Storage"],
        (oldData: IStorage[] | undefined) => {
          if (!oldData) return [];

          return oldData.filter(
            (storage) => storage.storage_id !== variables.storage_id,
          );
        },
      );
    },

    onError(error: AxiosError<IErrorResponse>) {
      message.error(error?.response?.data?.detail);
    },
  });

  return { mutate };
};
