'use client'

import { getAccessToken, getRefreshToken } from '@/services/auth-token.service';
import React, { useEffect } from 'react'
import { Toaster } from 'sonner';
import { useNotificationStore } from '../../../store/notificationStore';
import { authService } from '@/services/auth.service';
import { useQueryClient } from '@tanstack/react-query';

export default function Notification() {
    const refreshToken = getRefreshToken()
    const queryClient = useQueryClient();

    const setNotifications = useNotificationStore((state) => state.setNotifications)
    useEffect(() => {
        const connectWebSocket = () => {
          const accessToken = getAccessToken();
          if (!accessToken) {
            return;
          }

          const socket = new WebSocket(`ws://192.168.30.153:8000/notify/ws?token=${accessToken}`);

          socket.onopen = () => {
            console.log("WebSocket connection established");
            // socket.send("Hello, server!");
          };

          socket.onerror = (error) => {
            console.error("WebSocket error:", error);
          };

          socket.onmessage = (event) => {
            const notification = JSON.parse(event.data);
            if( notification.detail.type === 'info'){
                setNotifications(notification.detail.data)
                queryClient.invalidateQueries({queryKey:['OrderUser']})

            }
            if( notification.detail.type === "new_order" || notification.detail.type === "agreed" || notification.detail.type === "reject" ){
              queryClient.invalidateQueries({queryKey:['approvalOrders']})
            }
          };

          socket.onclose = (event) => {
            console.log("WebSocket connection closed", event);
            if(event.code === 4001){
                authService.refresh({refresh_token:refreshToken as string})
            }
            if (event.code !== 1000) { // If not a normal closure
              setTimeout(connectWebSocket, 3000); // Reconnect after 3 seconds
            }
          };

          return () =>{
            if (socket.readyState === WebSocket.OPEN) {
                socket.close(1000, 'Пришло время закончить работу');
              }
          }
        };

        connectWebSocket();
      }, []);


  return (
    <div><Toaster/></div>
  )
}