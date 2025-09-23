"use client";

import { IHelp } from "@/interface/help";
import { Card, Typography } from "antd";
import styles from "./HelpCard.module.scss";

const { Paragraph } = Typography;

interface Props {
  item: IHelp;
}

export default function HelpCard({ item }: Props) {
  return (
    <Card
      title={item.help_name}
    //   hoverable
      className={styles.helpCard}
    >
      <div className={styles.videoWrapper}>
        <video
          src={process.env.NEXT_PUBLIC_API_URL + item.link}
          controls
          className={styles.helpVideo}
        />
      </div>
      <Paragraph className={styles.description}>
        <strong>Описание: </strong>
        {item.note}
      </Paragraph>
    </Card>
  );
}
