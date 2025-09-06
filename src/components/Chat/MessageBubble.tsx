// components/MessageBubble.tsx
import { Avatar, Tooltip, Typography } from "antd";
import React from "react";
import styles from "./Chat.module.scss";
import { IMessage } from "@/interface/message";
import { formatMessageDate } from "@/helper/DataFormat";
import { useIsCurrentUser } from "@/helper/CurrentUser";
import { CheckCheck } from "lucide-react";
import { getUserColor } from "@/helper/colorCache";

const { Paragraph } = Typography;

interface MessageBubbleProps {
  msg: IMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ msg }) => {
  const isMe = useIsCurrentUser(msg.sender.sender_id);
  const { background, text } = getUserColor(msg.sender.sender_id);

  return (
    <div
      className={`${styles.messageBubble} ${
        isMe ? styles.currentUser : styles.otherUser
      } ${styles.appear}`}
    >
      <div
        className={`${styles.messageContent} ${
          isMe
            ? styles.messageContentCurrentUser
            : styles.messageContentOtherUser
        }`}
      >
        <Tooltip title={msg.sender.sender_name}>
        <Avatar
          style={{
            backgroundColor: background,
            verticalAlign: "middle",
            color: text,
            fontWeight: "500",

          }}
          size="default"
          alt={msg.sender.sender_name}

        >
          {msg.sender.sender_name.split(" ")[0][0]}
          {msg.sender.sender_name.split(" ")[1][0]}
        </Avatar>
        </Tooltip>

        <div className={styles.messageTextWrapper}>
          <Paragraph
            style={{ margin: 0 }}
            className={isMe ? styles.currentUser : styles.otherUser}
          >
            <p className={styles.messageText}>{msg.message}</p>
            <p className={styles.messageCreateAt}>
              {formatMessageDate(msg.created_at)}{" "}
              {isMe && <CheckCheck size={14} strokeWidth={3} />}
            </p>
          </Paragraph>
        </div>
      </div>
    </div>
  );
};
