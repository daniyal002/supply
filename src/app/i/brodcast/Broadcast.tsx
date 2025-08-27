'use client';

import { useSendBroadcastNotification } from '@/hook/notificationHook';
import { Button, Form, Input, message } from 'antd';
import React from 'react';

export default function Broadcast() {
  const [form] = Form.useForm();
  const { mutate, isPending } = useSendBroadcastNotification();

  const handleSubmit = (values: { message: string }) => {
    mutate(values.message);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Отправить рассылку</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={isPending}
      >
        <Form.Item
          name="message"
          label="Сообщение"
          rules={[{ required: true, message: 'Введите сообщение!' }]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Введите текст сообщения для рассылки"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isPending}>
            {isPending ? 'Отправка...' : 'Отправить всем'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}