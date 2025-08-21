import { Modal } from "antd";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import style from "./ModalCommentSelectProductOrder.module.scss";
import { useProductData } from "@/hook/productHook";
import { IOrderProductCommentsRequest } from "@/interface/orderProductComments";
import { useAddOrderProductCommentMutation } from "@/hook/orderHook";

interface Props {
  type: "Добавить" | "Изменить";
  productId?: number;
  orderProductId?:number;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  editProductId: number | null;
  orderId:number;
}

const ModalCommentSelectProductOrder: React.FC<Props> = ({
  type,
  productId,
  orderProductId,
  isModalOpen,
  setIsModalOpen,
  editProductId,
  orderId,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IOrderProductCommentsRequest>({ mode: "onChange" });
  const { productData } = useProductData();
  const { mutate: addOrderProductCommentMutation } = useAddOrderProductCommentMutation(orderId);

  const itemProductData = productData?.find(
    (product) => product.product_id === productId
  );

  const onSubmit: SubmitHandler<IOrderProductCommentsRequest> = (data) => {
    if (orderProductId) {
      addOrderProductCommentMutation({
        order_product_id: orderProductId,
        comment: data.comment,
        product_count: data.product_count,
      });
      reset();
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    if (type === "Добавить") {
      reset({
        product_count: undefined,
        comment: undefined,
      });
    } else if (type === "Изменить" && editProductId !== null) {
      reset({
        // note:productToEdit?.note,
      });
    }
  }, [type, reset, editProductId, isModalOpen]);

  return (
    <Modal
      title={`Добавить комментрий к: ${itemProductData?.product_name}`}
      open={isModalOpen}
      onCancel={() => {
        setIsModalOpen(false);
        reset();
      }}
      footer={null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className={style.modalForm}>
        <div className={style.formItem}>
          <label className={style.formItemLabel}>Количество</label>
          <input
            type="text"
            placeholder="Количество"
            className={style.modalName}
            {...register("product_count", {
              required: { value: true, message: "Количество обязательно" },
              pattern: {
                value: /^\d+(\.\d+)?$/,
                message: "Вводить можно только цифры",
              },
              min: {
                value: 0.1,
                message: "Количество не должно быть меньше 0.1. Если вы хотите отклонить, то отклоните через кнопку 'Отклонить' ",
              },
            })}
          />
          {errors.product_count && (
            <p className={style.error}>{errors.product_count.message}</p>
          )}
        </div>

        <div className={style.formItem}>
          <label className={style.formItemLabel}>Примечание</label>
          <textarea
            placeholder="Примечание"
            className={style.modalTextArea}
            {...register("comment")}
          />
        </div>

        <button type="submit" className={style.modalSubmit}>
          {type}
        </button>
      </form>
    </Modal>
  );
};

export default ModalCommentSelectProductOrder;
