import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { housingService } from "@/services/housing.service";
import { IHousing } from "@/interface/housing";
import { IErrorResponse } from "@/interface/error";
import axios, { AxiosError } from "axios";
import { message } from "antd";

export const useHousingData = () => {
  const {
    data: housingsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["Housings"],
    queryFn: housingService.getHousing,
    staleTime: Infinity,
  });
  return { housingsData, isLoading, error };
};

export const useCreateHousingMutation = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationKey: ["createHousing"],
    mutationFn: (data: IHousing) =>
      housingService.addHousing(data.housing_name),
    onSuccess: (newHousing) => {
      message.success(`Корпус "${newHousing.housing.housing_name}" успешно создан`)
      queryClient.setQueryData(
        ["Housings"],
        (oldData: IHousing[] | undefined) => {
          if (!oldData) return [];
          return [...oldData, newHousing.housing];
        }
      );
    },
    onError(error: AxiosError<IErrorResponse>) {
      message.error(error?.response?.data?.detail);
    },
  });
  return { mutate };
};

export const useUpdateHousingMutation = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationKey: ["updateHousing"],
    mutationFn: (data: IHousing) => housingService.updateHousing(data),
    onSuccess: (updatedHousing, variables) => {
      message.success(`Корпус "${variables.housing_name}" успешно изменен`)
      queryClient.setQueryData(
        ["Housings"],
        (oldData: IHousing[] | undefined) => {
          if (!oldData) return [];
          return oldData.map((housing) =>
            housing.housing_id === variables.housing_id ? variables : housing
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

export const useDeleteHousingMutation = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["deleteHousing"],
    mutationFn: (data: IHousing) => housingService.deleteHousingById(data),
    onSuccess: (updatedHousing, variables) => {
      message.success(`Корпус "${variables.housing_name}" успешно удален`)
      queryClient.setQueryData(
        ["Housings"],
        (oldData: IHousing[] | undefined) => {
          if (!oldData) return [];
          return oldData.filter((housing) => housing.housing_id !== variables.housing_id);
        }
      );
    },
    onError(error: AxiosError<IErrorResponse>) {
      message.error(error?.response?.data?.detail);
    },
  });
  return { mutate };
};
