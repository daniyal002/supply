"use client";

import { Card, Spin, Typography } from "antd";
import styles from "./HelpCard.module.scss";
import { CloseCircleFilled, EyeOutlined } from "@ant-design/icons";
import { generatePoster } from "@/helper/generatorPoster";
import { formatNotificationDate } from "@/helper/DataFormat";
import { useEffect } from "react";
import { useHelpData, useRegisterHelpView } from "@/hook/helpHook";
import { useRouter } from "next/navigation";

const { Paragraph } = Typography;

interface Props {
  help_id: number;
}

export default function HelpItem({ help_id }: Props) {
  const {back} = useRouter()
  const { mutate } = useRegisterHelpView();
  const { data, isError, isLoading, error } = useHelpData();

  const item = data?.find((item) => item.help_id === help_id);

  useEffect(() => {
    mutate(help_id);
  }, []);

  if (isLoading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}>
        <Spin spinning />
      </div>
    );
  }

  if (isError) {
    return <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}>{error?.message}</div>;
  }

  return (
    item ? (
      <Card
        className={styles.helpCard}
        title={
          <div className={styles.titleWrapper}>
            <CloseCircleFilled className={styles.closeIcon} onClick={() => back()} />
          </div>
        }
      >
        <div className={styles.videoWrapper}>
          <video
            src={process.env.NEXT_PUBLIC_API_URL + item.link}
            controls
            className={styles.helpVideo}
            poster={generatePoster({ text: item.help_name })}
          />
        </div>
        <Paragraph className={styles.title}>{item.help_name}</Paragraph>
        <Paragraph className={styles.description}>
          <strong>Описание: </strong>
          {item.note}
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
    ): (
      <div>
        <p>Видео не найдено</p>
      </div>
    )
  );
}
