"use client";

import { IHelp } from "@/interface/help";
import Image from "next/image";
import { Card, Typography } from "antd";
import styles from "./HelpCard.module.scss";
import {  EyeOutlined } from "@ant-design/icons";
import { generatePoster } from "@/helper/generatorPoster";
import { formatNotificationDate } from "@/helper/DataFormat";
import Link from "next/link";


const { Paragraph } = Typography;

interface Props {
  item: IHelp;
}

export default function HelpCard({ item }: Props) {
  return (
    <Card className={styles.helpCard}>
      <Link  href={`/help/${item.help_id}`}>
      <div className={styles.videoWrapper}>
        <Image
          src={generatePoster({ text: item.help_name })}
          className={styles.helpVideo}
          alt={item.link}
          width={300}
          height={200}
        />
      </div>
      <Paragraph className={styles.title}>{item.help_name}</Paragraph>
      <Paragraph className={styles.description}>
        <strong>Описание: </strong>

        <p
        >
          {item.note.length > 50
            ? item.note.substring(0, 50) + "..."
            : item.note}
        </p>
      </Paragraph>
      <Paragraph className={styles.datePublication}>
        <Typography.Text strong>Дата публикации: </Typography.Text>
        {formatNotificationDate(item.created_at)}
      </Paragraph>
      <div className={styles.viewCount}>
        <EyeOutlined />
        {item.view_count}
      </div>
      </Link>
    </Card>
  );
}
