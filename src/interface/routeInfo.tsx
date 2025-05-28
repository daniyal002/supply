export interface IRouteInfoResponse {
  detail: string;
  steps: IRouteStepsInfo[];
  current_step_id: number;
}

export interface IRouteStepsInfo {
  step_container_id: number;
  approvers: string;
  step_number: number;
}
