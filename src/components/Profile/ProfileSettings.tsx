import { Space, Switch } from "antd";
import { useState } from "react";
import styles from './Profile.module.scss';


const ProfileSettings = () => {
  const [newsEnabled, setNewsEnabled] = useState(true);


    const handleNewsToggle = (checked: boolean) => {
        setNewsEnabled(checked);
        // Здесь можно отправить запрос на бэкенд
        console.log('Новости включены:', checked);
      };

    return(
        <div className={styles.settings}>
                  <Space align="center" size="large">
                    <span>Получать новости</span>
                    <Switch checked={newsEnabled} onChange={handleNewsToggle} />
                  </Space>
                </div>
    )

}

export default ProfileSettings;