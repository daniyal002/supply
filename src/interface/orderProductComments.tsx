export interface IOrderProductCommentsRequest {
  order_product_id: number;
  product_count: number;
  comment: string;
}

export interface IOrderProductCommentsResponse {
//   order_product_id: number;
  comment_id:number
  product_count: number;
  comment: string;
  employee: string;
  created_at: string;
}
