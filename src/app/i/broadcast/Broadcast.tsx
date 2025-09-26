"use client";

import { useSendBroadcastNotification } from "@/hook/notificationHook";
import {
  Button,
  Form,
  Input,
  Modal,
  Popover,
  message as antdMessage,
} from "antd";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import React, { useEffect, useMemo, useState } from "react";
import { SmileOutlined } from "@ant-design/icons";

interface BroadcastFormValues {
  message: string;
}

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

export default function Broadcast({ isModalOpen, setIsModalOpen }: Props) {
  const [form] = Form.useForm<BroadcastFormValues>();
  const [hasMessage, setHasMessage] = useState<boolean>(false);
  const {
    mutate,
    isPending,
    data: broadcastData,
    isSuccess,
  } = useSendBroadcastNotification();
  const [isOpenEmojiPicker, setIsOpenEmojiPicker] = useState(false);

  const handleSubmit = (values: BroadcastFormValues) => {
    mutate(values.message, {
      onSuccess: () => {
        form.resetFields();
      },
    });
  };

  const handleEmojiSelect = (emoji: { native: string }) => {
    const currentMsg = form.getFieldValue("message") || "";
    form.setFieldsValue({ message: currentMsg + emoji.native });
    if(form.getFieldValue("message")){
      setHasMessage(true)
    }else{
      setHasMessage(false)
    }
  };


  return (
    <>
      <Modal
        title="📢 Рассылка"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        maskClosable={false}
        closable={false}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>
            Отмена
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isPending}
            onClick={() => form.submit()}
            disabled={!hasMessage}
          >
            Отправить
          </Button>,
        ]}
      >
        <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto" }}>
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
                { required: true, message: "Введите сообщение!" },
                {
                  max: 1000,
                  message: "Сообщение не должно превышать 1000 символов",
                },
              ]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Введите текст сообщения для рассылки"
                onChange={(e) => {
                  form.setFieldsValue({ message: e.target.value });
                  if(form.getFieldValue("message")){
                    setHasMessage(true)
                  }else{
                    setHasMessage(false)
                  }
                }}
              />
            </Form.Item>

            <Form.Item>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  justifyContent: "space-between",
                }}
              >
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
                    icon={
                      <SmileOutlined
                        style={{ fontSize: 20, color: "#678098" }}
                      />
                    }
                    style={{
                      border: "1px solid #d9d9d9",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    }}
                    type="default"
                  />
                </Popover>
              </div>
            </Form.Item>

            {broadcastData && (
              <div
                style={{
                  marginTop: "16px",
                  padding: "12px",
                  backgroundColor: isSuccess ? "#f6ffed" : "#fff2f0",
                  border: `1px solid ${isSuccess ? "#b7eb8f" : "#ffccc7"}`,
                  borderRadius: "6px",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: isSuccess ? "#52c41a" : "#ff4d4f",
                  }}
                >
                  {broadcastData}
                </p>
              </div>
            )}
          </Form>
        </div>
      </Modal>
    </>
  );
}
