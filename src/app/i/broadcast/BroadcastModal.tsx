// components/BroadcastModal.tsx
'use client';

import { useWebSocket } from '@/hook/useWebSocket';
import { Modal, Button } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

interface BroadcastMessage {
    type: 'broadcast';
    data: string;
}

export default function BroadcastModal() {
  const [message, setMessage] = useState<BroadcastMessage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Обработчик только для типа 'broadcast'

const handleBroadcast = useCallback((event: any) => {
  setMessage(event);
  setIsModalOpen(true);
}, []);

useWebSocket({
  broadcast: handleBroadcast,
});


  const handleOk = () => {
    setIsModalOpen(false);
    // Можно отправить подтверждение бэкенду
  };

  return (
    <Modal
      title="📢 Техническое сообщение"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleOk} // чтобы нельзя было отменить
      okText="Понятно"
      maskClosable={false}
      closable={false}
      footer={[
        <Button key="ok" type="primary" onClick={handleOk}>
          Понятно
        </Button>,
      ]}
    >
      <p>{message?.data}</p>
    </Modal>
  );
}