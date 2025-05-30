import { axiosWidthAuth } from "@/api/interseptors";
import {
  IDraftOrderItemAddResponse,
  IDraftOrderItemRequest,
  IOrderDraftItemByIdResponse,
  IOrderDraftItemResponse,
  IOrderDrafttemRequestDelete,
  IOrderItemByIdResponse,
} from "@/interface/orderItem";

export const orderTempService = {
  async getUserTempOrder() {
    const response = await axiosWidthAuth.get<IOrderDraftItemResponse>(
      "/order/get_user_temp_order"
    );
    return response.data.detail;
  },

   async getOrderTempById(id: string) {
      if (!isNaN(Number(id)) && Number(id) > 0) {
        const response = await axiosWidthAuth.get<IOrderDraftItemByIdResponse>(
          `/order/get_temp_order_by_id?order_temp_id=${id}`
        );
        return response.data.detail;
      }
    },

  async saveOrder(data: IDraftOrderItemRequest) {
    const response = await axiosWidthAuth.post<IDraftOrderItemAddResponse>(
      "/order/save_temp_order",
      data
    );
    return response.data;
  },

  async updateOrder(data: IDraftOrderItemRequest) {
    const response = await axiosWidthAuth.put<IDraftOrderItemAddResponse>(
      "/order/update_temp_order",
      data
    );
    return response.data;
  },

  async deleteTempOrderById(data: IOrderDrafttemRequestDelete) {
    const response = await axiosWidthAuth.delete<string>(
      "order/delete_temp_order",
      { data: data }
    );
    return response.data;
  },

  async deleteTempOrderAll() {
    const response = await axiosWidthAuth.delete<string>(
      "order/delete_all_temp_order"
    );
    return response.data;
  },
};
