import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { departmentService } from "@/services/department.service";
import { IDepartment } from "@/interface/department";
import { IErrorResponse } from "@/interface/error";
import axios, { AxiosError } from "axios";
import { message } from "antd";

export const useDepartmentData = () => {
  const {
    data: departmentData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["Departments"],
    queryFn: departmentService.getDepartment,
    staleTime: Infinity,
  });
  return { departmentData, isLoading, error };
};

export const useCreateDepartmentMutation = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["createDepartment"],
    mutationFn: (data: IDepartment) =>
      departmentService.addDepartment({
        department_name: data.department_name,
        housing_id: data.housing?.id as number,
      }),
    onSuccess: (newDepartment) => {
      queryClient.setQueryData(
        ["Departments"],
        (oldData: IDepartment[] | undefined) => {
          if (!oldData) return [];
          return [...oldData, newDepartment.department];
        }
      );
    },
    onError(error: AxiosError<IErrorResponse>) {
      message.error(error?.response?.data?.detail);
    },
  });
  return { mutate };
};

export const useUpdateDepartmentMutation = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["updateDepartment"],
    mutationFn: (data: IDepartment) => 
      departmentService.updateDepartment({
        id: data.department_id,
        department_name: data.department_name,
        housing_id: data.housing?.id as number,
      }),
    onSuccess: (updatedDepartment, variables) => {
      queryClient.setQueryData(
        ["Departments"],
        (oldData: IDepartment[] | undefined) => {
          if (!oldData) return [];
          return oldData.map((department) =>
            department.department_id === variables.department_id ? variables : department
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

export const useDeleteDepartmentMutation = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["deleteDepartment"],
    mutationFn: (data: IDepartment) =>
      departmentService.deleteDepartmentById({
        id: data.department_id,
        department_name: data.department_name,
        housing_id: data.housing?.id as number,
      }),
    onSuccess: (updatedDepartment, variables) => {
      queryClient.setQueryData(
        ["Departments"],
        (oldData: IDepartment[] | undefined) => {
          if (!oldData) return [];
          return oldData.filter((department) => department.department_id !== variables.department_id);
        }
      );
    },
    onError(error: AxiosError<IErrorResponse>) {
      message.error(error?.response?.data?.detail);
    },
  });
  return { mutate };
};
