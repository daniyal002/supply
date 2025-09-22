import { axiosWidthAuth } from "@/api/interseptors";
import { IConnectedUserResponse, INotificationResponse } from "@/interface/notification";

export const notificationService = {

    async getNotification() {
        const response = await axiosWidthAuth.get<INotificationResponse>(
          "/notify/get_notification"
        );

        return response.data.detail;
      },

      async markAsReadNotification(notification_id:number) {
        const response = await axiosWidthAuth.post<string>(
          "/notify/mark_as_read_notification",{notification_id}
        );

        return response.data;
      },

      async markAsReadAllNotifications(){
        const response = await axiosWidthAuth.post<string>("/notify/mark_as_read_all_notifications")

        return response.data
      },

      async sendBroadcastNotification(message:string){
        const response = await axiosWidthAuth.post<{detail:string}>(`/notify/send_broadcast_notification?notification_message=${message}`)

        return response.data.detail
      },

      async getConnectedUsers(){
        const response = await axiosWidthAuth.get<IConnectedUserResponse>(`/notify/get_connected_users`)

        return response.data.detail
      },

      async sendNotificationMessage(employee_id:string,message:string){
        const response = await axiosWidthAuth.post<string>(`/notify/send_notification_message?employee_id=${employee_id}&message=${message}`)

        return response.data
      },


}