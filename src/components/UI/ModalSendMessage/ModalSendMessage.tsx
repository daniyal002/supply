import { Button, Form, Input, Modal } from "antd";
import { useUserData } from "@/hook/userHook";
import { useMemo, useState } from "react";
import { IEmployee } from "@/interface/employee";
import { useSendNotificationMessage } from "@/hook/notificationHook";

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  buyerId: string;
}

const ModalSendMessage: React.FC<Props> = ({
  isModalOpen,
  setIsModalOpen,
  buyerId,
}) => {
  const { userData } = useUserData();

  const currentUser: IEmployee | undefined = useMemo(() => {
    return userData?.find(
      (user) => user.employee.buyer_id === Number(buyerId)
    )?.employee as IEmployee | undefined;
  }, [buyerId, userData]);

  const [message, setMessage] = useState<string>("");

  const { mutate, isPending } = useSendNotificationMessage();

  const handleSend = () => {
    if (!message.trim() || !currentUser) return;

    mutate(
      { buyer_id: String(currentUser.buyer_id), message },
      {
        onSuccess: () => {
          setMessage("");
          setIsModalOpen(false);
        },
      }
    );
  };

  return (
    <Modal
      title={`Отправка сообщения пользователю ${
        currentUser?.buyer_name ?? "—"
      }`}
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={[
        <Button key="cancel" onClick={() => setIsModalOpen(false)}>
          Отмена
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isPending}
          onClick={handleSend}
          disabled={!message.trim()}
        >
          Отправить
        </Button>,
      ]}
    >
      <Form layout="vertical">
        <Form.Item label="Сообщение">
          <Input.TextArea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Введите сообщение..."
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalSendMessage;
