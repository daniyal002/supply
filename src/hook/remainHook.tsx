import { remainService } from "@/services/remain.service"
import { useQuery } from "@tanstack/react-query"

export const useRemainProductById = (product_kod_1c:string) => {
    const {data:remainProductById,isError,isLoading,refetch} = useQuery({
        queryKey:['Remain',product_kod_1c],
        queryFn: () => remainService.getRemainProductById(product_kod_1c),
        enabled: !!product_kod_1c, // <-- опционально: не запрашивать без кода
        staleTime: 0, // ❗Данные считаются устаревшими сразу после загрузки
    })

    return {remainProductById,isError,isLoading,refetch}
}