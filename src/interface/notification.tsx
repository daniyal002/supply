export interface INotification{
    notification_id:number,
    notification_message:string,
    is_red:boolean,
    created_at:string,
    notification_type:"new_order"| "step_approval"| "rejection"| "info",
    buyer_id:number,
    data_id:number,
}

export interface INotificationResponse{
    detail:INotification[]
}