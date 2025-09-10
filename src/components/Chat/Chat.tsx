import { Button, Input, Popover, Space, Typography } from "antd";
import {
  FullscreenOutlined,
  SendOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import React, { Ref, useEffect } from "react";
import styles from "./Chat.module.scss";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { IMessage } from "@/interface/message";
import { MessageBubble } from "./MessageBubble";
import { groupMessagesByDate } from "@/helper/groupMessagesByDate";

const { Text } = Typography;

interface Props {
  orderId: number;
  messages: IMessage[];
  isOpenEmojiPicker: boolean;
  setIsOpenEmojiPicker: (isOpenEmojiPicker: boolean) => void;
  messagesEndRef: Ref<HTMLDivElement>;
  supplyTheme: string;
  sendMessage: (message:string) => void;
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
            <div style={{display:'flex', flexDirection:"column", gap:"15px"}}>
            {msgs.map((msg,index) => (
              <MessageBubble msg={msg} key={index} />
            ))}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
        {!isModalOpen && (
          <Button
            style={{
              position: "absolute",
              right: 30,
              bottom: 150,
              backgroundColor: "#00000061",
              display: isModalOpen ? "none" : "block",
            }}
            onClick={() => setIsModalOpen(true)}
          >
            <FullscreenOutlined style={{ color: "#fff" }} />
          </Button>
        )}
      </div>

      <div className={styles.inputContainer}>
        <Input.TextArea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              sendMessage(inputValue);
            }
          }}
          placeholder="Введите сообщение... (Shift + Enter для новой строки)"
          autoSize={{ minRows: 1, maxRows: 3 }}
          style={{
            borderRadius: 16,
            padding: "12px 16px",
            fontSize: 14,
            boxShadow: "0 2px 8px var(--ant-shadow-color)",
          }}
        />
        <div className={styles.inputFooter}>
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
                emojiSize={16}
                previewPosition="none"
                searchPosition="none"
              />
            }
            title={null}
            trigger="click"
            open={isOpenEmojiPicker}
            onOpenChange={setIsOpenEmojiPicker}
            placement="top"
          >
            <Button
              type="dashed"
              icon={<SmileOutlined style={{ fontSize: 18 }} />}
            />
          </Popover>
          <Button type="primary" icon={<SendOutlined />} onClick={() => sendMessage(inputValue)}>
            Отправить
          </Button>
        </div>
      </div>
    </div>
  );
}
