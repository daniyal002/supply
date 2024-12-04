import { axiosWidthAuth } from "@/api/interseptors"
import { IUnitMeasurement } from "@/interface/basicUnit"
import { IProductGroupResponse, IProductResponse } from "@/interface/product"

export const productService = {
    async getProduct (){
        const response = await axiosWidthAuth.get<IProductResponse>('/product/get_product')
        return response.data.detail
    },
    async getProductGroup(){
        const response =  await axiosWidthAuth.get<IProductGroupResponse>('/product/get_product_group')
        return response.data.detail
    },
    async getAllUnitMeasurment(){
        const response =  await axiosWidthAuth.get<IUnitMeasurement>('/product/get_all_unit_measurement')
        return response.data.detail
    }
}