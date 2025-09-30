"use client";

import { Tabs, Card, Typography, Button, Spin } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import styles from "./Profile.module.scss";
import ProfileDetails from "./ProfileDetails";
import ProfileSettings from "./ProfileSettings";
import ProfileChangePassword from "./ProfileChangePassword";
import { IEmployeeGetMe } from "@/interface/employee";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db/db";

const { Title } = Typography;

const Profile = () => {
  const router = useRouter();
  const GetMeData = useLiveQuery(() => db.getMe.toCollection().first(), []);

  if (!GetMeData) {
    return (
      <Spin
        spinning={!GetMeData}
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      />
    );
  }

  const handleGoBack = () => {
    router.push("/"); // или router.push('/dashboard') — если нужно на конкретную страницу
  };

  return (
    <div className={styles.profileContainer}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <Button
            type="primary"
            icon={<LeftOutlined />}
            style={{
              marginBottom: 16,
              backgroundColor: "#678098",
              borderColor: "#678098",
              fontWeight: 600,
            }}
            onClick={handleGoBack}
          >
            Назад
          </Button>
          <Title level={3} className={styles.title}>
            Профиль пользователя
          </Title>
        </div>

        <Tabs
          defaultActiveKey="1"
          className={styles.tabs}
          items={[
            {
              key: "1",
              label: "Данные о пользователе",
              children: (
                <ProfileDetails
                  login={GetMeData?.login || ""}
                  created_at={GetMeData?.created_at || ""}
                  updated_at={GetMeData?.updated_at || ""}
                  role={GetMeData?.role}
                  employee={GetMeData?.employee as IEmployeeGetMe}
                />
              ),
            },
            {
              key: "2",
              label: "Настройки",
              children: <ProfileSettings />,
              // disabled: true,
            },
            {
              key: "3",
              label: "Сменить пароль",
              children: <ProfileChangePassword />,
              disabled: true,
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default Profile;
