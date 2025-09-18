import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useThemeStore } from "../../../store/themeStore";
import Chat from "./Chat";
import { Modal } from "antd";
import { useMessageStore } from "../../../store/chatStore";
import { useWebSocket } from "@/hook/useWebSocket";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db/db";
import { useOnlineStore } from "../../../store/OnlineStore";
import { getCurrentDateWithMicroseconds } from "@/helper/DataFormat";
import { IMessage } from "@/interface/message";

interface Props {
  orderId: number;
}

export default function ChatCore({ orderId }: Props) {
  const { supplyTheme } = useThemeStore();

  const messages = useMessageStore((state) =>
    state.data.find((data) => data.orderId === orderId)
  );

  const setMessages = useMessageStore((state) => state.setMessages);

  const [isOpenEmojiPicker, setIsOpenEmojiPicker] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Глобальный онлайн-стор
  const { openTab, closeTab, getTabCount } = useOnlineStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleHistory = useCallback((event: any) => {
    setMessages(event.data.order_id, event.data.messages.reverse());
  }, []);



  const handleNewMessage = useCallback((event: any) => {
    const newMessage = {
      message_id: event.data.message_id,
      created_at: event.data.created_at,
      message: event.data.message,
      order_id: event.data.order_id,
      sender: {
        sender_id: event.data.sender.sender_id as number,
        sender_name: event.data.sender.sender_name as string,
      },
    };

    setMessages(event.data.order_id, (prev: IMessage[] | undefined) => [
      ...(prev || []),
      newMessage,
    ]);
  }, [setMessages]); // ✅ Только setMessages — стабильно!

  useEffect(() => {
    scrollToBottom();
  }, [messages,isModalOpen]);

  const { sendMessage } = useWebSocket({
    new_chat_message: handleNewMessage,
    chat_history: handleHistory,
  });


  useEffect(() => {
    if (orderId === 1) return;

    // Открываем таб
    openTab(orderId);

    // Проверяем: если это первая вкладка с этим orderId — отправляем is_online: true
    if (getTabCount(orderId) === 1) {
      sendMessage({
        type: "join_chat",
        order_id: orderId,
      });
    }

    // При размонтировании
    return () => {
      // Уменьшаем счётчик
      closeTab(orderId);

      // Если после закрытия вкладки больше нет — отправляем is_online: false
      if (getTabCount(orderId) === 0) {
        sendMessage({
          type: "leave_chat",
          order_id: orderId,
        });
      }
    };
  }, [orderId, sendMessage]);

  const meData = useLiveQuery(() => db.getMe.toCollection().first(), []);

  const sendMessageInChat = useCallback((message: string) => {
    if (!message.trim()) return; // Защита от пустых сообщений

    const messageBody = {
      type: "chat_message",
      order_id: orderId,
      message,
    };

    const success = sendMessage(messageBody);

    if (success) {
      setInputValue(""); // Очищаем инпут
    } else {
      alert("Не удалось отправить сообщение. Сокет не подключён.");
    }
  }, [orderId, sendMessage, setMessages, meData]); // ✅ Без `messages`!

  if (isModalOpen) {
    return (
      <Modal
        closable={{ "aria-label": "Custom Close Button" }}
        onCancel={() => setIsModalOpen(false)}
        open={isModalOpen}
        width={"100vw"}
        centered
        footer={() => <></>}
      >
        <Chat
          inputValue={inputValue}
          isModalOpen={isModalOpen}
          isOpenEmojiPicker={isOpenEmojiPicker}
          messages={messages?.messages || []}
          messagesEndRef={messagesEndRef}
          orderId={orderId}
          sendMessage={sendMessageInChat}
          setInputValue={setInputValue}
          setIsModalOpen={setIsModalOpen}
          setIsOpenEmojiPicker={setIsOpenEmojiPicker}
          supplyTheme={supplyTheme}
        />
      </Modal>
    );
  }

  return (
    !isModalOpen && (
      <Chat
        inputValue={inputValue}
        isModalOpen={isModalOpen}
        isOpenEmojiPicker={isOpenEmojiPicker}
        messages={messages?.messages || []}
        messagesEndRef={messagesEndRef}
        orderId={orderId}
        sendMessage={sendMessageInChat}
        setInputValue={setInputValue}
        setIsModalOpen={setIsModalOpen}
        setIsOpenEmojiPicker={setIsOpenEmojiPicker}
        supplyTheme={supplyTheme}
      />
    )
  );
}
