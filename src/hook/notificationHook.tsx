import { notificationService } from "@/services/notification.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNotificationStore } from "../../store/notificationStore";
import { message } from "antd";
import { useNotificationChatStore } from "../../store/notificationChatStore";

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

export const useMarkAsReadNotification = (type: 'chat' | 'info') => {
  const deleteNotification = useNotificationStore(
    (state) => state.deleteNotification
  );

  const deleteNotificationChat = useNotificationChatStore(
    (state) => state.deleteNotificationChat
  );

  const { mutate } = useMutation({
    mutationKey: ["markAsRead"],
    mutationFn: (notification_id: number) =>
      notificationService.markAsReadNotification(notification_id),
    onSuccess(data, variables) {
      type === 'chat' ? deleteNotificationChat(variables) : deleteNotification(variables);

    },
  });

  return { mutate };
};

export const useMarkAsReadAllNotification = (type: 'chat' | 'info') => {
  const deleteAllNotification = useNotificationStore(
    (state) => state.deleteAllNotification
  );

  const deleteAllNotificationChat = useNotificationChatStore(
    (state) => state.deleteAllNotificationChat
  );

  const { mutate } = useMutation({
    mutationKey: ["markAsRead"],
    mutationFn: notificationService.markAsReadAllNotifications,
    onSuccess() {
      type === 'chat' ? deleteAllNotificationChat() : deleteAllNotification();
    },
  });

  return { mutate };
};

export const useSendBroadcastNotification = () => {
  const { mutate, isPending } = useMutation({
    mutationKey: ["sendBroadcast"],
    mutationFn: (message: string) =>
      notificationService.sendBroadcastNotification(message),
    onSuccess: () => {
      message.success('Сообщение отправлено!');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Ошибка отправки');
    },
  });

  return { mutate, isPending };
};
