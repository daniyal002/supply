import { axiosWidthAuth } from "@/api/interseptors";
import { INotificationResponse } from "@/interface/notification";

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
}