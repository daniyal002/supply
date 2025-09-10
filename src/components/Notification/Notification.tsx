"use client";

import { Toaster } from "sonner";
import { useNotificationStore } from "../../../store/notificationStore";
import { useWebSocket } from "@/hook/useWebSocket";
import { useCallback } from "react";
import { useNotificationChatStore } from "../../../store/notificationChatStore";

export default function Notification() {
  const setNotifications = useNotificationStore(
    (state) => state.setNotifications
  );

  const setNotificationsChat = useNotificationChatStore(
    (state) => state.setNotificationsChat
  );
  // Подписываемся на нужные типы событий
  const handleInfo = useCallback((event: any) => {
    setNotifications(event.data);
  }, []);

  const handleInfoChat = useCallback((event: any) => {
    setNotificationsChat(event.data);
  }, []);

  useWebSocket({
    info: handleInfo,
    info_chat_message:handleInfoChat
  });




  return (
    <div>
      <Toaster />
    </div>
  );
}
