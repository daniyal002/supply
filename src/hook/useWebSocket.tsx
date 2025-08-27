// hooks/useWebSocket.ts
'use client';

import { useEffect, useRef } from 'react';
import { getAccessToken, getRefreshToken } from '@/services/auth-token.service';
import { authService } from '@/services/auth.service';
import { useQueryClient } from '@tanstack/react-query';
import { WebSocketMessage } from '@/interface/webSocet';

type WebSocketHandler = (event: WebSocketMessage) => void;

// --- Состояние вне хука ---
let socket: WebSocket | null = null;
let handlers: { [type: string]: WebSocketHandler } = {};
let reconnectTimeout: number | null = null;
let isInitialized = false;

export const useWebSocket = (newHandlers: { [type: string]: WebSocketHandler }) => {
  const queryClient = useQueryClient();

  // Обновляем обработчики при каждом вызове
  useEffect(() => {
    // Добавляем новые обработчики
    Object.assign(handlers, newHandlers);

    // Запускаем соединение, если ещё не запущено
    if (!isInitialized) {
      isInitialized = true;
      connect(queryClient);
    }

    // При размонтировании — ничего не удаляем (можно улучшить)
    return () => {
      // Можно почистить, если нужно
    };
  }, [newHandlers, queryClient]);
};

const connect = (queryClient: any) => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  if (!accessToken) {
    console.warn('No access token');
    return;
  }

  const url = `${process.env.NEXT_PUBLIC_WS_URL}/notify/ws?token=${accessToken}`;
  socket = new WebSocket(url);

  socket.onopen = () => {
    console.log('WebSocket connection established');
  };

  socket.onmessage = (event) => {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      const { type } = message.detail;

      // Вызываем обработчик
      if (handlers[type]) {
        handlers[type](message);
      }

      // Инвалидация
      if (type === 'new_order' || type === 'agreed' || type === 'reject') {
        queryClient.invalidateQueries({ queryKey: ['approvalOrders'] });
      }
      if (type === 'info') {
        queryClient.invalidateQueries({ queryKey: ['OrderUser'] });
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  socket.onclose = (event) => {
    console.log('WebSocket connection closed', event);
    socket = null;

    if (event.code === 4001) {
      if (refreshToken) {
        authService.refresh({ refresh_token: refreshToken });
      }
    }

    // Переподключение
    if (event.code !== 1000 && !event.wasClean) {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      reconnectTimeout = window.setTimeout(() => connect(queryClient), 3000);
    }
  };
};