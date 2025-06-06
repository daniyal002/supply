import { notificationService } from "@/services/notification.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNotificationStore } from "../../store/notificationStore";

export const useNotificationData = () => {
  const {
    data: notificationData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["notification"],
    queryFn: notificationService.getNotification,
    // staleTime: Infinity,
  });
  return { notificationData, isLoading, error };
};

export const useMarkAsReadNotification = () => {
  const deleteNotification = useNotificationStore((state) => state.deleteNotification);

  const {mutate} = useMutation({
    mutationKey: ["markAsRead"],
    mutationFn: (notification_id:number) => notificationService.markAsReadNotification(notification_id),
    onSuccess(data,variables){
      deleteNotification(variables)
    }
  })

  return { mutate}
}

export const useMarkAsReadAllNotification = () => {
  const deleteAllNotification = useNotificationStore((state) => state.deleteAllNotification);

  const {mutate} = useMutation({
    mutationKey: ["markAsRead"],
    mutationFn: notificationService.markAsReadAllNotifications,
    onSuccess(){
      deleteAllNotification()
    }
  })

  return { mutate}
}
