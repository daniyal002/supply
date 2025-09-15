'use client';

import { useSendBroadcastNotification } from '@/hook/notificationHook';
import { Button, Form, Input, message, Popover } from 'antd';
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import React, { useState } from 'react';
import { SmileOutlined } from '@ant-design/icons';

interface BroadcastFormValues {
  message: string;
}

export default function Broadcast() {
  const [form] = Form.useForm<BroadcastFormValues>();
  const { mutate, isPending, data: broadcastData, isSuccess } = useSendBroadcastNotification();
  const [isOpenEmojiPicker, setIsOpenEmojiPicker] = useState<boolean>(false);

  const handleSubmit = (values: BroadcastFormValues) => {
    mutate(values.message);
  };

  const handleEmojiSelect = (emoji: { native: string }) => {
    const message = form.getFieldValue('message') || '';
    form.setFieldsValue({ message: message + emoji.native });
    setIsOpenEmojiPicker(false);
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
          rules={[
            { required: true, message: 'Введите сообщение!' },
            { max: 1000, message: 'Сообщение не должно превышать 1000 символов' }
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Введите текст сообщения для рассылки"
          />
        </Form.Item>

        <Form.Item>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent:"space-between" }}>
            {/* Кнопка эмодзи */}
            <Popover
              content={
                <Picker
                  data={data}
                  onEmojiSelect={handleEmojiSelect}
                  locale="ru"
                  emojiSize={18}
                  previewPosition="none"
                  searchPosition="none"
                />
              }
              trigger="click"
              open={isOpenEmojiPicker}
              onOpenChange={setIsOpenEmojiPicker}
              placement="top"
            >
              <Button
                shape="circle"
                icon={<SmileOutlined style={{ fontSize: 20, color: "#678098" }} />}
                style={{
                  border: "1px solid #d9d9d9",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                }}
                type="default"
              />
            </Popover>

            <Button
              type="primary"
              htmlType="submit"
              loading={isPending}
              disabled={isPending}
            >
              {isPending ? 'Отправка...' : 'Отправить всем'}
            </Button>
          </div>
        </Form.Item>

        {broadcastData && (
          <div style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: isSuccess ? '#f6ffed' : '#fff2f0',
            border: `1px solid ${isSuccess ? '#b7eb8f' : '#ffccc7'}`,
            borderRadius: '6px'
          }}>
            <p style={{ margin: 0, color: isSuccess ? '#52c41a' : '#ff4d4f' }}>
              {broadcastData}
            </p>
          </div>
        )}
      </Form>
    </div>
  );
}