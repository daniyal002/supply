import { useState } from "react";
import ProductOrderTable from "./ProductOrderTable";
import { IProductTable } from "@/interface/productTable";
import { IOrderItemFormValues } from "@/interface/orderItem";
import {
  UseFormGetValues,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import ModalCommentSelectProductOrder from "./ModalCommentSelectProductOrder/ModalCommentSelectProductOrder";
import ModalCommentCancelSelectProductOrder from "./ModalCommentCancelSelectProductOrder/ModalCommentCancelSelectProductOrder";

interface Props {
  productTableData: IProductTable[];
  watch: UseFormWatch<IOrderItemFormValues>;
  getValues: UseFormGetValues<IOrderItemFormValues>;
  setValue: UseFormSetValue<IOrderItemFormValues>;
  readonly?:boolean
  exportToExcel: () => void
  handlePrint: () => void
  isPrinting:boolean,
}

export default function ProductOrder({
  productTableData,
  getValues,
  setValue,
  readonly = false,
  exportToExcel,
  handlePrint,
  isPrinting,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [productId, setProductId] = useState<number>();
  const [orderProductId, setOrderProductId] = useState<number>();
  const [productIndex, setProductIndex] = useState<number>();

  const [isModalOpenCancel, setIsModalOpenCancel] = useState<boolean>(false);
  const [productIdCancel, setProductIdCancel] = useState<number>();
  const [orderProductIdCancel, setOrderProductIdCancel] = useState<number>();
  const [productIndexCancel, setProductIndexCancel] = useState<number>();


  const orderId = getValues("order_id");

  const showModal = () => {
    setIsModalOpen(true);
  };

  const showModalCancel = () => {
    setIsModalOpenCancel(true)
  }

  const deleteProduct = (productIndex: number) => {
    const updatedProducts = getValues("order_products").filter(
      (_, index) => index !== productIndex
    );
    setValue("order_products", updatedProducts);
  };

  return (
    <>
      <ModalCommentSelectProductOrder
        type="Изменить"
        isModalOpen={isModalOpen}
        editProductId={productIndex as number}
        productId={productId}
        setIsModalOpen={setIsModalOpen}
        orderProductId={orderProductId}
        orderId={orderId as number}
      />
      <ModalCommentCancelSelectProductOrder
       type="Изменить"
       isModalOpen={isModalOpenCancel}
       editProductId={productIndexCancel as number}
       productId={productIdCancel}
       setIsModalOpen={setIsModalOpenCancel}
       orderProductId={orderProductIdCancel}
       orderId={orderId as number}
      />
      <ProductOrderTable
        showModal={showModal}
        showModalCancel={showModalCancel}
        productTableData={productTableData}
        setProductId={setProductId}
        setProductIdCancel={setProductIdCancel}
        setOrderProductId={setOrderProductId}
        setOrderProductIdCancel={setOrderProductIdCancel}
        setProductIndex={setProductIndex}
        setProductIndexCancel={setProductIndexCancel}
        deleteProduct={deleteProduct}
        orderId={orderId as number}
        readonly={readonly}
        exportToExcel={exportToExcel}
        handlePrint={handlePrint}
        isPrinting={isPrinting}
      />
    </>
  );
}
