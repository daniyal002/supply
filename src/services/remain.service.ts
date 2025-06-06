import { axiosWidthAuth } from "@/api/interseptors"
import { IRemainByIdResponse } from "@/interface/remain"

export const remainService = {
    async getRemainProductById(product_kod_1c:string){
        const response = await axiosWidthAuth.get<IRemainByIdResponse>(`/product/get_remain_product_by_1c_code?product_kod_1c=${product_kod_1c}`)
        return response.data.detail
    }
}