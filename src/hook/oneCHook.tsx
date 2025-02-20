import { IErrorResponse } from "@/interface/error";
import { onecService } from "@/services/onec-integration.service"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { message } from "antd";
import { AxiosError } from "axios";


export const useUpdateAndUploadProduct1c = () => {
  const queryClient = useQueryClient();

    const {mutate, isPending} = useMutation({
        mutationKey:['UpdateAndUploadProduct1c'],
        mutationFn: () => onecService.uploadAndUpdateProducts1с(),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey:['newProduct']})
            message.success("Успешная загрузка данных")
        },
        onError(error: AxiosError<IErrorResponse>) {
              message.error(error?.response?.data?.detail);
            },
    })

    return {mutate,isPending}
}