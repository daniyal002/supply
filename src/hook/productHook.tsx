import { productService } from "@/services/product.service";
import { useQuery } from "@tanstack/react-query";

export const useProductData = () => {
    const { data: productData, isLoading, error } = useQuery({queryKey:['newProduct'],queryFn:productService.getProduct});
    return {productData, isLoading, error}
}

export const useProductGroupData = () =>{
    const { data: productGroupData, isLoading, error } = useQuery({queryKey:['productGroup'],queryFn:productService.getProductGroup})
    return {productGroupData, isLoading, error}
}