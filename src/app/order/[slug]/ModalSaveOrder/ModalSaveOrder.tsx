import { Button, Modal } from "antd";
import { UseFormGetValues } from "react-hook-form";
import { IOrderItemFormValues, IOrderItemRequest } from "@/interface/orderItem";

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  getValues: UseFormGetValues<IOrderItemFormValues>;
  saveOrder: () => void
}

const ModalSaveOrder: React.FC<Props> = ({
  isModalOpen,
  setIsModalOpen,
  saveOrder
}) => {

  return (
    <Modal
      title="Автосохранение"
      open={isModalOpen}
      onCancel={() => {
        setIsModalOpen(false);
      }}
      footer={() => (
        <>
        <Button onClick={() => saveOrder()}>Да</Button>
        <Button onClick={() => setIsModalOpen(false)}>Нет</Button>
        </>
      )}
    >
        <p>Желаете сохранить новую текущую заявку ? </p>
    </Modal>
  );
};

export default ModalSaveOrder;
