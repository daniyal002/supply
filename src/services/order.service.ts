import { axiosWidthAuth } from "@/api/interseptors";
import {
  IOrderArchiveRequest,
  IOrderDocumentDeleteRequest,
  IOrderDocumentUploadResponse,
  IOrderItem,
  IOrderItemAddResponse,
  IOrderItemByIdResponse,
  IOrderItemRequest,
  IOrderItemRequestDelete,
  IOrderItemResponse,
  IOrderTo1CRequest,
  IStatusOrderResponse,
} from "@/interface/orderItem";
import { IRouteInfoResponse } from "@/interface/routeInfo";
import { IStepHistoryResponse } from "@/interface/stepHistory";
import { saveApprovalCount } from "./auth-token.service";
import {
  IOrderAddProductCancelCommentRequest,
  IOrderAddProductCancelResponse,
  IOrderDeleteProductCancelCommentRequest,
  IOrderProductCommentsRequest,
} from "@/interface/orderProductComments";

export const orderService = {
  async getOrderById(id: string) {
    if (!isNaN(Number(id)) && Number(id) > 0) {
      const response = await axiosWidthAuth.get<IOrderItemByIdResponse>(
        `/order/get_order_by_id?order_id=${id}`
      );
      return response.data.detail;
    }
  },
  async getApprovalOrders() {
    const response = await axiosWidthAuth.get<IOrderItemResponse>(
      "/order/get_approval_orders"
    );

    if (response) {
      saveApprovalCount(response.data.detail.length.toString());
    }
    return response.data.detail;
  },
  async getOrderStatus() {
    const response = await axiosWidthAuth.get<IStatusOrderResponse>(
      "/order/get_order_status"
    );
    return response.data.detail;
  },

  async getUserOrder() {
    const response = await axiosWidthAuth.get<IOrderItemResponse>(
      "/order/get_user_order"
    );
    return response.data.detail;
  },

  async getOrders(product_ids?: string[]) {
    const response = await axiosWidthAuth.get<IOrderItemResponse>(
      `/order/get_all_order${product_ids ? "?" + product_ids.map((id) => `product_id=${id}`).join("&") : ""}`
    );
    return response.data.detail;
  },

  async getOrdersWhereUserIsApprover() {
    const response = await axiosWidthAuth.get<IOrderItemResponse>(
      "/order/get_orders_where_user_is_approver"
    );
    return response.data.detail;
  },

  async getOrderStepHistory(order_id: number) {
    if (!isNaN(Number(order_id)) && Number(order_id) > 0) {
      const response = await axiosWidthAuth.get<IStepHistoryResponse>(
        `/order/get_order_steps_history?order_id=${order_id}`
      );
      return response.data.steps_history;
    }
  },

  async getOrderRouteSteps(order_id: number) {
    if (!isNaN(Number(order_id)) && Number(order_id) > 0) {
      const response = await axiosWidthAuth.get<IRouteInfoResponse>(
        `/order/get_order_route_steps?order_id=${order_id}`
      );
      return response.data;
    }
  },

  async addOrder(data: IOrderItemRequest) {
    const response = await axiosWidthAuth.post<IOrderItemAddResponse>(
      "order/add_order",
      data
    );
    return response.data;
  },

  async updateOrder(data: IOrderItemRequest) {
    const response = await axiosWidthAuth.put<IOrderItemAddResponse>(
      "order/update_order",
      data
    );
    return response.data;
  },

  async uploadOrderDocument(files: File[]) {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await axiosWidthAuth.post<IOrderDocumentUploadResponse>(
      "/order/upload_order_document",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data.detail;
  },

  async deleteOrderDocument(data: IOrderDocumentDeleteRequest) {
    const response = await axiosWidthAuth.delete<string>(
      "/order/delete_order_document",
      { data }
    );
    return response.data;
  },

  async agreedOrder(order_id: number, note: string) {
    const response = await axiosWidthAuth.put<string>("/order/agreed_order", {
      order_id,
      note,
    });
    return response.data;
  },

  async rejectOrder(order_id: number, note: string) {
    const response = await axiosWidthAuth.put<string>("/order/reject_order", {
      order_id,
      note,
    });
    return response.data;
  },
  async deleteOrderById(data: IOrderItemRequestDelete) {
    const response = await axiosWidthAuth.delete<string>(
      "order/delete_order_by_id",
      { data: data }
    );
    return response.data;
  },

  async resetOrder(order_id: number) {
    const response = await axiosWidthAuth.put<IOrderItemAddResponse>(
      "order/reset_order",
      { order_id: order_id }
    );
    return response.data;
  },

  async addOrderProductComment(data: IOrderProductCommentsRequest) {
    const response = await axiosWidthAuth.post(
      "/order/add_order_product_comment",
      data
    );
    return response.data;
  },

  async deleteOrderProductComment(data: { comment_id: number }) {
    const response = await axiosWidthAuth.delete(
      "/order/delete_order_product_comment",
      { data: data }
    );
    return response.data;
  },

  async addOrderProductCancelComment(data: IOrderAddProductCancelCommentRequest) {
    const response = await axiosWidthAuth.post<IOrderAddProductCancelResponse>(
      "/order/add_order_product_cancel_comment",
      data
    );
    return response.data;
  },

  async deleteOrderProductCancelComment(data: IOrderDeleteProductCancelCommentRequest) {
    const response = await axiosWidthAuth.delete<string>(
      "/order/delete_order_product_cancel_comment",
      { data: data }
    );
    return response.data;
  },

  async forceSubmitOrderTo1c(data:IOrderTo1CRequest){
    const response = await axiosWidthAuth.post<string>('/order/force_submit_order_to_1c',data)
    return response.data
  },

  async archiveOrder(data:IOrderArchiveRequest){
    const response = await axiosWidthAuth.put<string>('/order/archive_order',data)
    return response.data
  }
};
