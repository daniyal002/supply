import { productService } from "@/services/product.service";
import { IErrorResponse } from "@/interface/error";
import { useMutation, useQuery } from "@tanstack/react-query";
import { message } from "antd";
import { AxiosError } from "axios";

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

export const useUploadImage = () => {
    const {mutate: uploadImage, data:uploadImageData} = useMutation({
        mutationKey:["uploadImage"],
        mutationFn: (files:File[]) => productService.uploadProductImage(files)
    })

    return {uploadImage,uploadImageData}
}

export const useDeleteImage = () => {
    const {mutate: deleteImage} = useMutation({
        mutationKey:["deleteImage"],
        mutationFn: (fileName:string) => productService.deleteProductImage(fileName)
    })

    return {deleteImage}
}

export const useUpdateOrderProductEmployeesMutation = () => {
    const { mutate, mutateAsync, isPending } = useMutation({
        mutationKey: ["updateOrderProductEmployees"],
        mutationFn: productService.updateOrderProductEmployees,
        onError(error: AxiosError<IErrorResponse>) {
            message.error(error?.response?.data?.detail || "Ошибка обновления сотрудников товара");
        }
    });

    return { mutate, mutateAsync, isPending };
}
