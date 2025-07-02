import { axiosWidthAuth } from "@/api/interseptors"
import { IOrderStatus, IOrderStatusCreateResponse, IOrderStatusResponse } from "@/interface/orderStatus"

export const orderStatusService = {
    async getStatus(){
        const response = await axiosWidthAuth.get<IOrderStatusResponse>('/order/get_status')
        return response.data.detail
    },

    async addStatus(data:IOrderStatus){
        const response = await axiosWidthAuth.post<IOrderStatusCreateResponse>('/order/add_status',data)
        return response.data.detail
    },

    async updateStatus(data:IOrderStatus){
        const response = await axiosWidthAuth.put<string>('/order/update_status',data)
        return response.data
    },

    async deleteStatusById(data:{status_id: number}){
        const response = await axiosWidthAuth.delete<string>('/order/delete_status_by_id',{data:data})
        return response.data
    }

}