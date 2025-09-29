'use client';

import React, { useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import styles from './NewsTicker.module.scss';
import { Button } from 'antd';

interface NewsTickerProps {
  news: string;
  speed?: number; // в секундах, по умолчанию 20
}

const NewsTicker: React.FC<NewsTickerProps> = ({
  news = 'Новости не загружены',
  speed = 20,
}) => {
  const [isClosed, setIsClosed] = useState(false);

  const handleClose = () => {
    setIsClosed(true);
  };



  if (isClosed) {
    return null;
  }

  // Дублируем текст, чтобы избежать разрывов при прокрутке
  const duplicatedNews = `${news}`;

  return (
    <div
      className={styles.tickerContainer}
    >
      <div className={styles.tickerWrapper}>
        <div
          className={styles.ticker}
          style={{
            animationDuration: `${speed}s`,
          }}
        >
         Полезная информация: {duplicatedNews}
        </div>

        {/* {isHovered && ( */}
          <Button
            type="primary"
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Закрыть новости"
            size='small'
          >
            <CloseOutlined  style={{fontSize:"14px", color:"ff0000", fontWeight:"bold"}}/>
          </Button>
         {/* )} */}
      </div>
    </div>
  );
};

export default NewsTicker;