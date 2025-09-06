export interface IMessage {
    message_id?:number,
    order_id:number,
    sender:{
        sender_id:number,
        sender_name:string
    }
    message:string,
    created_at:string
}