import { helpService } from "@/services/help.service"
import { useQuery } from "@tanstack/react-query"

export const useHelpData = () => {

    const {data, isLoading, isError, error} = useQuery({
        queryFn:helpService.getHelp,
        queryKey:['help'],
        staleTime: 1000 * 60 * 5,
    })

    return {data, isLoading, isError, error}

}