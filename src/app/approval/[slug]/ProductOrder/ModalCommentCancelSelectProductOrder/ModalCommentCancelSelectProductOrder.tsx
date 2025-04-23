import { Modal } from "antd";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import style from "./ModalCommentCancelSelectProductOrder.module.scss";
import { useProductData } from "@/hook/productHook";
import { IOrderAddProductCancelCommentRequest } from "@/interface/orderProductComments";
import { useAddOrderProductCancelCommentMutation } from "@/hook/orderHook";

interface Props {
  type: "Добавить" | "Изменить";
  productId?: number;
  orderProductId?: number;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  editProductId: number | null;
  orderId: number;
}

const ModalCommentCancelSelectProductOrder: React.FC<Props> = ({
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
  } = useForm<IOrderAddProductCancelCommentRequest>({ mode: "onChange" });
  const { productData } = useProductData();
  const { mutate: addOrderProductCancelCommentMutation } =
    useAddOrderProductCancelCommentMutation(orderId);

  const itemProductData = productData?.find(
    (product) => product.product_id === productId
  );

  const onSubmit: SubmitHandler<IOrderAddProductCancelCommentRequest> = (
    data
  ) => {
    if (orderProductId) {
      addOrderProductCancelCommentMutation({
        order_product_id: orderProductId,
        comment: data.comment,
      });
      reset();
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    if (type === "Добавить") {
      reset({
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
      title={`Отклонить: ${itemProductData?.product_name}`}
      open={isModalOpen}
      onCancel={() => {
        setIsModalOpen(false);
        reset();
      }}
      footer={null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className={style.modalForm}>
        <div className={style.formItem}>
          <label className={style.formItemLabel}>Примечание</label>
          <textarea
            placeholder="Примечание"
            className={style.modalTextArea}
            {...register("comment", {
              required: "Примечание обязательно для заполнения",
            })}
          />
          {errors.comment && (
            <p className={style.error}>{errors.comment.message}</p>
          )}
        </div>

        <button type="submit" className={style.modalSubmit}>
          Отклонить
        </button>
      </form>
    </Modal>
  );
};

export default ModalCommentCancelSelectProductOrder;
