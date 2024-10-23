import { axiosWidthAuth } from "@/api/interseptors"
import { IOrderItem, IOrderItemAddResponse, IOrderItemByIdResponse, IOrderItemRequest, IOrderItemRequestDelete, IOrderItemResponse, IStatusOrderResponse } from "@/interface/orderItem"

export const orderService = {
    async getOrderById (id:string){
        if (!isNaN(Number(id)) && Number(id) > 0) {
            const response = await axiosWidthAuth.get<IOrderItemByIdResponse>(`/order/get_order_by_id?order_id=${id}`)
            return response.data.detail
          }
    },
    async getApprovalOrders (){
        const response = await axiosWidthAuth.get<IOrderItemResponse>('/order/get_approval_orders')
        return response.data.detail

    },
    async getOrderStatus (){
        const response = await axiosWidthAuth.get<IStatusOrderResponse>('/order/get_order_status')
        return response.data.detail
    },

    async getUserOrder (){
        const response = await axiosWidthAuth.get<IOrderItemResponse>("/order/get_user_order")
        return response.data.detail
    },

    async addOrder(data:IOrderItemRequest){
        const response = await axiosWidthAuth.post<IOrderItemAddResponse>('order/add_order',data)
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