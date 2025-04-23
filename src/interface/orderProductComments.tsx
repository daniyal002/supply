export interface IOrderProductCommentsRequest {
  order_product_id: number;
  product_count: number;
  comment: string;
}

export interface IOrderProductCommentsResponse {
  //   order_product_id: number;
  comment_id: number;
  product_count: number;
  comment: string;
  employee: string;
  created_at: string;
}

export interface IOrderAddProductCancelCommentRequest {
  order_product_id: number;
  comment: string;
}

export interface IOrderDeleteProductCancelCommentRequest {
  order_product_id: number;
  cancel_comment_id: number;
}

export interface IOrderProductCancelCommentResponse {
  comment_cancel_id: number;
  comment: string;
  employee: string;
  created_at: string;
}


export interface IOrderAddProductCancelResponse {
  detail: IOrderProductCancelCommentResponse
}