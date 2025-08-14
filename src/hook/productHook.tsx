import { productService } from "@/services/product.service";
import { useQuery } from "@tanstack/react-query";

export const useProductData = () => {
    const { data: productData, isLoading, error, refetch } = useQuery({queryKey:['newProduct'],queryFn:productService.getProduct});
    return {productData, isLoading, error, refetch}
}

export const useProductGroupData = () =>{
    const { data: productGroupData, isLoading, error } = useQuery({queryKey:['productGroup'],queryFn:productService.getProductGroup})
    return {productGroupData, isLoading, error}
}

export const useAllMesument = () => {
    const { data: allMesument, isLoading, error } = useQuery({queryKey:['allMesument'],queryFn:productService.getAllUnitMeasurment})
    return {allMesument, isLoading, error}
}