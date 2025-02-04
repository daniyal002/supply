'use client'

import { getAccessToken, getRefreshToken } from '@/services/auth-token.service';
import React, { useEffect } from 'react'
import { toast, Toaster } from 'sonner';
import { useNotificationStore } from '../../../store/notificationStore';
import { authService } from '@/services/auth.service';

export default function Notification() {
    const refreshToken = getRefreshToken()
    const setNotifications = useNotificationStore((state) => state.setNotifications)
    useEffect(() => {
        const connectWebSocket = () => {
          const accessToken = getAccessToken();
          if (!accessToken) {
            console.error('No access token available');
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
            console.log(notification)
            if( notification.detail.type === 'info'){
                setNotifications(notification.detail.data)
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