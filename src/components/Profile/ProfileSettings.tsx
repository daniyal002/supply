import { Space, Switch } from "antd";
import { useState } from "react";
import styles from "./Profile.module.scss";

const ProfileSettings = () => {
  const [newsEnabled, setNewsEnabled] = useState(localStorage.getItem("newsEnabled") === "true");

  const handleNewsToggle = (checked: boolean) => {
    setNewsEnabled(checked);
    localStorage.setItem("newsEnabled", checked.toString());
  };

  return (
    <div className={styles.settings}>
      <Space align="center" size="large">
        <span>Получать новости</span>
        <Switch checked={newsEnabled} onChange={handleNewsToggle} /> <span className={styles.settingsNewsDescription}>(Обновите страницу чтобы применить изменения)</span>
      </Space>
    </div>
  );
};

export default ProfileSettings;
