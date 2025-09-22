export interface INotification{
    notification_id:number,
    notification_message:string,
    is_red:boolean,
    created_at:string,
    notification_type:"new_order"| "step_approval"| "rejection"| "info" | 'info_chat_message',
    buyer_id:number,
    data_id:number,
}

export interface INotificationResponse{
    detail:INotification[]
}

export interface IConnectedUser{
    buyer_id:number,
    buyer_name:string,
    connected_at:string
}

export interface IConnectedUserResponse{
    detail:IConnectedUser[]
}