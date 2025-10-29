import { Button, Form, Input } from "antd";
import styles from "./Profile.module.scss";
import { useChangePassword } from "@/hook/useAuth";

const ProfileChangePassword = () => {
  const [form] = Form.useForm();
const {mutate,isSuccess,error} = useChangePassword()
  const onFinish = (values: {
    oldPassword: string;
    newPassword: string;
    confirm: string;
  }) => {
    // Логика смены пароля
    mutate({
      old_password:values.oldPassword,
      new_password:values.newPassword,
      confirm_password:values.confirm})
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
        <Button type="primary" htmlType="submit" size="large">
          Поменять пароль
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProfileChangePassword;
