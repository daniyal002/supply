"use client";

import { Tabs, Card, Typography, Button, Spin } from "antd";
import { ArrowLeftOutlined, LeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import styles from "./Profile.module.scss";
import ProfileDetails from "./ProfileDetails";
import ProfileSettings from "./ProfileSettings";
import ProfileChangePassword from "./ProfileChangePassword";
import { useGetMe } from "@/hook/userHook";
import { IEmployeeGetMe } from "@/interface/employee";

const { Title } = Typography;

const Profile = () => {
  const router = useRouter();
  const { GetMeData, isLoading, error } = useGetMe();

  if (isLoading) {
    return (
      <Spin
        spinning={isLoading}
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      />
    );
  }

  if (error) {
    return <div>Ошибка: {error.message}</div>;
  }

  const handleGoBack = () => {
    router.back(); // или router.push('/dashboard') — если нужно на конкретную страницу
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
            },
            {
              key: "3",
              label: "Сменить пароль",
              children: <ProfileChangePassword />,
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default Profile;