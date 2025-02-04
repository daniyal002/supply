import { notificationService } from "@/services/notification.service";
import { useMutation, useQuery } from "@tanstack/react-query";

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
  const {mutate} = useMutation({
    mutationKey: ["markAsRead"],
    mutationFn: notificationService.markAsReadNotification,
  })

  return { mutate}
}
