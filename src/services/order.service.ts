import { axiosWidthAuth } from "@/api/interseptors"
import { IOrderItem, IOrderItemByIdResponse, IOrderItemRequest, IOrderItemRequestDelete, IOrderItemResponse } from "@/interface/orderItem"

export const orderService = {
    async getOrderById (id:string){
        const response = await axiosWidthAuth.get<IOrderItemByIdResponse>(`/order/get_order_by_id?order_id=${id}`)
        return response.data.detail
    },

    async getUserOrder (){
        const response = await axiosWidthAuth.get<IOrderItemResponse>("/order/get_user_order")
        return response.data.detail
    },

    async addOrder(data:IOrderItemRequest){
        const response = await axiosWidthAuth.post<IOrderItem>('order/add_order',data)
        return response.data
    },

    async updateOrder(data:IOrderItemRequest){
        const response = await axiosWidthAuth.put<string>('order/update_order',data)
        return response.data
    },

    async deleteOrderById(data:IOrderItemRequestDelete){
        const response = await axiosWidthAuth.delete<string>('order/delete_order_by_id',{data:data},)
        return response.data
    }
}