import React, {
  useCallback,
  useEffect,
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

interface Props {
  orderId: number;
}

export default function ChatCore({ orderId }: Props) {
  const { supplyTheme } = useThemeStore();

  const messages = useMessageStore((state) => state.data.find(data => data.orderId === orderId));
  const setMessages = useMessageStore((state) => state.setMessages);


  const [isOpenEmojiPicker, setIsOpenEmojiPicker] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleHistory = useCallback((event: any) => {
    setMessages(event.detail.order_id, event.detail.data.reverse());
  }, []);

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const { sendMessage } = useWebSocket({
    history_chat_message: handleHistory,
  });



  useEffect(() => {
    const messageBody = {
      type: "chat_history_order",
      order_id: orderId,
    };

    sendMessage(messageBody);
  },[orderId])

  const meData = useLiveQuery(() => db.getMe.toCollection().first(), []);

  const sendTestMessage = (message: string) => {
    const messageBody = {
      type: "chat_message",
      order_id: orderId,
      message,
    };
    if(message){
      const success = sendMessage(messageBody);
    if (success) {
      setInputValue("");
    } else {
      alert("Не удалось отправить сообщение. Сокет не подключён.");

    }
  }else{

  }

  };

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
          sendMessage={sendTestMessage}
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
        sendMessage={sendTestMessage}
        setInputValue={setInputValue}
        setIsModalOpen={setIsModalOpen}
        setIsOpenEmojiPicker={setIsOpenEmojiPicker}
        supplyTheme={supplyTheme}
      />
    )
  );
}
