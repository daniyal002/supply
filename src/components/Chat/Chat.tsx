import { Button, Input, Popover, Space } from "antd";
import {
  FullscreenOutlined,
  SendOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import React, { Ref } from "react";
import styles from "./Chat.module.scss";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { IMessage } from "@/interface/message";
import { MessageBubble } from "./MessageBubble";
import { groupMessagesByDate } from "@/helper/groupMessagesByDate";


interface Props {
  orderId: number;
  messages: IMessage[];
  isOpenEmojiPicker: boolean;
  setIsOpenEmojiPicker: (isOpenEmojiPicker: boolean) => void;
  messagesEndRef: Ref<HTMLDivElement>;
  supplyTheme: string;
  sendMessage: (message: string) => void;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
}

export default function Chat({
  orderId,
  messages,
  isOpenEmojiPicker,
  setIsOpenEmojiPicker,
  messagesEndRef,
  supplyTheme,
  sendMessage,
  inputValue,
  setInputValue,
  isModalOpen,
  setIsModalOpen,
}: Props) {
  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div
      className={styles.chatContainer}
      style={{ height: isModalOpen ? "90vh" : "" }}
    >
      <Space align="center" className={styles.chatHeader}>
        <p style={{ color: "#fff" }}>Чат по заявке №{orderId}</p>
      </Space>

      <div className={styles.messagesContainer}>
        {/* Проходим по каждой дате */}
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date}>
            {/* Заголовок даты */}
            <div className={styles.dateDivider}>
              <span>{date}</span>
            </div>
            {/* Сообщения за эту дату */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              {msgs.map((msg) => (
                  <MessageBubble msg={msg}  key={msg.message_id} />
              ))}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      <div
        className={styles.inputContainer}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 12px",
          background: "#f1f3f5",
          // borderRadius: "9999px",
        }}
      >
        {/* Кнопка эмодзи */}
        <Popover
          className={styles.emojiPicker}
          content={
            <Picker
              data={data}
              onEmojiSelect={(e: { native: string }) =>
                setInputValue((prev) => prev + e.native)
              }
              locale="ru"
              theme={supplyTheme === "dark" ? "dark" : "light"}
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
            size="large"
            icon={<SmileOutlined style={{ fontSize: 28, color: "#678098" }} />}
            style={{
              // background: "#ffffff",
              border: "none",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
            type="text"
          />
        </Popover>

        {/* Поле ввода с анимацией ширины */}

        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              sendMessage(inputValue);
            }
          }}
          placeholder="Введите сообщение... (Shift + Enter для новой строки)"
          style={{
            borderRadius: "9999px",
            border: "1px solid #d0d7de",
            background: "#ffffff",
            padding: "10px 16px",
            fontSize: 18,
            width: "100%",
          }}
        />

        {/* Кнопка отправки */}
            <Button
              type="primary"
              shape="circle"
              size="large"
              icon={<SendOutlined />}
              onClick={() => sendMessage(inputValue)}
              style={{
                boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                // background: inputValue.trim().length === 0 ? 'gray' : 'red'
              }}
              disabled={inputValue.trim().length === 0}
              title="Отправить сообщение"
            />
          {!isModalOpen && (
            <Button
              style={{
                display: isModalOpen ? "none" : "block",
              }}
              size="large"
              onClick={() => setIsModalOpen(true)}
              type="primary"
              shape="circle"
              icon={<FullscreenOutlined style={{ color: "#fff" }} />}
              title="На полный экран"
            />
          )}
      </div>
    </div>
  );
}
