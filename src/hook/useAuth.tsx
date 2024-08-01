import { ILoginRequest } from "@/interface/auth";
import { authService } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from 'axios';
import { IErrorResponse } from "@/interface/error";
import { useRouter } from "next/navigation";
import { useHeaderStore } from "../../store/headerStore";


export const useLogin = () => {
	const { push } = useRouter()
    const setLogin = useHeaderStore((state) => state.setLogin)
    const {mutate, isSuccess, error} = useMutation({
        mutationKey:['login'],
        mutationFn:(data:ILoginRequest) => authService.login(data),
        onSuccess(data,variables){
            setLogin(variables.login)
            push("/")
        },
        onError(error:AxiosError<IErrorResponse>){
            alert(error)
          }  
      })

      return {mutate,isSuccess,error}
};