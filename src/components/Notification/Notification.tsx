'use client'

import { Toaster } from 'sonner';
import { useNotificationStore } from '../../../store/notificationStore';
import { useWebSocket } from '@/hook/useWebSocket';
import { useCallback } from 'react';

export default function Notification() {

    const setNotifications = useNotificationStore((state) => state.setNotifications)
  // Подписываемся на нужные типы событий
  const handleInfo = useCallback((event: any) => {
    setNotifications(event.detail.data);
  }, []);

  useWebSocket({
    info: handleInfo,
  });


  return (
    <div><Toaster/></div>
  )
}