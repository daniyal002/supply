import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { employeeService } from '@/services/employee.service';
import { IEmployee } from '@/interface/employee';
import { IErrorResponse } from '@/interface/error';
import axios, { AxiosError } from 'axios';
import { message } from 'antd';

export const useEmployeeData = () => {
  const { data: employeeData, isLoading, error } = useQuery({queryKey:['Employees'],queryFn:employeeService.getEmployee,
    staleTime: Infinity,
  });
  return {employeeData, isLoading, error}
}

export const useCreateEmployeeMutation = () => {
  const queryClient = useQueryClient();

    const {mutate} = useMutation({
        mutationKey:['createEmployee'],
        mutationFn:(data:IEmployee) => {
          const parlorIds: number[] = []
            data.parlor?.forEach(item=>{
                parlorIds.push(item.id as number)
            })
          return employeeService.addEmployee({employee:{buyer_name:data.buyer_name,buyer_type:data.buyer_type,post_id:data.post.id as number},parlor_ids:parlorIds})
        },
        onSuccess: (newEmployee) => {
          queryClient.setQueryData(
            ["Employees"],
            (oldData: IEmployee[] | undefined) => {
              if (!oldData) return [];
              return [...oldData, newEmployee.employee];
            }
          );
        },
        onError(error:AxiosError<IErrorResponse>){
          message.error(error?.response?.data?.detail)
        }    
    })
      return {mutate}
};

export const useUpdateEmployeeMutation = () => {
  const queryClient = useQueryClient();

    const {mutate} = useMutation({
        mutationKey:['updateEmployee'],
        mutationFn:(data:IEmployee) => 
          {
            const parlorIds: number[] = []
            data.parlor?.forEach(item=>{
                parlorIds.push(item.id as number)
            })
          return employeeService.updateEmployee({employee:{id:data.buyer_id,buyer_name:data.buyer_name,buyer_type:data.buyer_type,post_id:data.post.id as number},parlor_ids:parlorIds})
        },
        onSuccess: (updatedEmployee, variables) => {
          queryClient.setQueryData(
            ["Employees"],
            (oldData: IEmployee[] | undefined) => {
              if (!oldData) return [];
              return oldData.map((employee) =>
                employee.buyer_id === variables.buyer_id ? variables : employee
              );
            }
          );
        },
        onError(error:AxiosError<IErrorResponse>){
          message.error(error?.response?.data?.detail)
        }    
    })
      return {mutate}
};


export const useDeleteEmployeeMutation = () => {
  const queryClient = useQueryClient();

  const {mutate} = useMutation({
      mutationKey:['deleteEmployee'],
      mutationFn:(data:IEmployee) => employeeService.deleteEmployeeById(data),
      onSuccess: (updatedEmployee, variables) => {
        queryClient.setQueryData(
          ["Employees"],
          (oldData: IEmployee[] | undefined) => {
            if (!oldData) return [];
            return oldData.filter((employee) =>
              employee.buyer_id !== variables.buyer_id 
            );
          }
        );
      },
      onError(error:AxiosError<IErrorResponse>){
        message.error(error?.response?.data?.detail)
      }    
  })
    return {mutate}
};
