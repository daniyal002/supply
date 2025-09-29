import { Button, Form, Input } from "antd";
import styles from "./Profile.module.scss";

const ProfileChangePassword = () => {
  const [form] = Form.useForm();

  const onFinish = (values: {
    oldPassword: string;
    newPassword: string;
    confirm: string;
  }) => {
    console.log("Смена пароля:", values);
    // Логика смены пароля
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className={styles.changePasswordForm}
    >
      <Form.Item
        name="oldPassword"
        label="Старый пароль"
        rules={[{ required: true, message: "Введите старый пароль" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="newPassword"
        label="Новый пароль"
        rules={[
          { required: true, message: "Введите новый пароль" },
          { min: 6, message: "Пароль должен быть не менее 6 символов" },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Подтвердите пароль"
        dependencies={["newPassword"]}
        rules={[
          { required: true, message: "Подтвердите пароль" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("newPassword") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Пароли не совпадают"));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Сохранить
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProfileChangePassword;
