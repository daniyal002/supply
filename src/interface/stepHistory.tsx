export interface IStepHistory {
  steps_history_id: number;
  order_id: number;
  buyer_name: string;
  status_name: string;
  note: string;
  created_at: string;
}

export interface IStepHistoryResponse {
  detail: string;
  steps_history: IStepHistory[];
}
