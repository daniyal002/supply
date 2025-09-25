"use client";

import { IHelp } from "@/interface/help";
import Image from "next/image";
import { Card, Typography } from "antd";
import styles from "./HelpCard.module.scss";
import { CloseCircleFilled, EyeOutlined } from "@ant-design/icons";
import { generatePoster } from "@/helper/generatorPoster";
import { formatMessageDate, formatNotificationDate } from "@/helper/DataFormat";
import { useEffect } from "react";
import { useRegisterHelpView } from "@/hook/helpHook";

const { Paragraph } = Typography;

interface Props {
  item: IHelp;
  onClick?: () => void;
  type: "group" | "single";
}

export default function HelpCard({ item, onClick, type }: Props) {
  const { mutate } = useRegisterHelpView();

  useEffect(() => {
    if (type === "single") {
      mutate(item.help_id);
    }
  }, [type]);

  return (
    <Card
      className={styles.helpCard}
      title={
        type === "single" && (
          <div className={styles.titleWrapper}>
            <CloseCircleFilled
              onClick={() => {
                if (onClick) {
                  onClick();
                }
              }}
              className={styles.closeIcon}
            />
          </div>
        )
      }
    >
      <div className={styles.videoWrapper}>
        {type === "group" ? (
          <Image
            src={generatePoster({ text: item.help_name })}
            className={styles.helpVideo}
            onClick={onClick}
            alt={item.link}
            width={300}
            height={200}
          />
        ) : (
          <video
            src={process.env.NEXT_PUBLIC_API_URL + item.link}
            controls
            className={styles.helpVideo}
            poster={generatePoster({ text: item.help_name })}
          />
        )}
      </div>
      <Paragraph className={styles.title}>{item.help_name}</Paragraph>
      <Paragraph className={styles.description}>
        <strong>Описание: </strong>
        {type === "single" ? (
          item.note
        ) : (
          <p
            onClick={() => {
              if (onClick) {
                onClick();
              }
            }}
          >
            {item.note.length > 50
              ? item.note.substring(0, 50) + "..."
              : item.note}
          </p>
        )}
      </Paragraph>
      <Paragraph className={styles.datePublication}>
        <Typography.Text strong>Дата публикации: </Typography.Text>
        {formatNotificationDate(item.created_at)}
      </Paragraph>
      <div className={styles.viewCount}>
      <EyeOutlined />
        {item.view_count}
      </div>
    </Card>
  );
}
