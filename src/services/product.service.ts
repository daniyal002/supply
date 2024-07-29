import { axiosWidthAuth } from "@/api/interseptors"
import { IProductResponse } from "@/interface/product"

export const productService = {
    async getProduct (){
        const response = await axiosWidthAuth.get<IProductResponse>('/product/get_product')
        return response.data.detail
    },
}