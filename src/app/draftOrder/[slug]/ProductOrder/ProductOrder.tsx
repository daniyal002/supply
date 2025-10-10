import { useState } from "react";
import ProductOrderTable from "./ProductOrderTable";
import { IProductTable } from "@/interface/productTable";
import ModalSelectProductOrder from "@/components/UI/ModalSelectProductOrder/ModalSelectProductOrder";
import { EnumOrderTypes, IOrderItemFormValues } from "@/interface/orderItem";
import {
  UseFormGetValues,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { Button, message } from "antd";

interface Props {
  productTableData: IProductTable[];
  watch: UseFormWatch<IOrderItemFormValues>;
  getValues: UseFormGetValues<IOrderItemFormValues>;
  setValue: UseFormSetValue<IOrderItemFormValues>;
  disabledOrder: boolean;
  role: string;
  handlePrint: () => void
  isPrinting: boolean
}

export default function ProductOrder({
  productTableData,
  getValues,
  setValue,
  watch,
  disabledOrder,
  role,
  handlePrint,
  isPrinting,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [productId, setProductId] = useState<number>();
  const [productIndex, setProductIndex] = useState<number | null>();
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [type, setType] = useState<"Добавить" | "Изменить">("Изменить");

  // Следим за полем order_type
  const orderType = watch("order_type")
    ? watch("order_type")
    : { value: EnumOrderTypes.WAREHOUSE };

  const showModal = () => {
    setIsModalOpen(true);
    setIsNewProduct(false);
    setType("Изменить");
  };

  const showModalIsNewProduct = () => {
    setType("Добавить");
    setIsNewProduct(true);
    setProductIndex(null);
    setIsModalOpen(true);
  };
  const deleteProduct = (productIndex: number) => {
    const updatedProducts = getValues("order_products").filter(
      (_, index) => index !== productIndex
    );
    setValue("order_products", updatedProducts);
  };

  const orderId = getValues("order_id");

  return (
    <>
      <ModalSelectProductOrder
        type={type}
        isModalOpen={isModalOpen}
        editProductId={productIndex as number}
        productId={productId}
        setIsModalOpen={setIsModalOpen}
        getValues={getValues}
        setValue={setValue}
        watch={watch}
        isNewProduct={isNewProduct}
      />
      {!disabledOrder &&
        (role === "user_purchase" || role === "admin") &&
        orderType.value === EnumOrderTypes.PURCHASE && (
          <Button
            onClick={() => {
              if (!getValues("product_group.value")) {
                message.warning("Выберите категорию товара");
              } else {
                showModalIsNewProduct();
              }
            }}
            style={{ width: "100%", marginBottom: "10px" }}
          >
            Добавить новый товар
          </Button>
        )}
      <ProductOrderTable
        showModal={showModal}
        productTableData={productTableData}
        setProductId={setProductId}
        setProductIndex={setProductIndex}
        deleteProduct={deleteProduct}
        setIsNewProduct={setIsNewProduct}
        disabledOrder={disabledOrder}
        orderId={orderId as number}
        handlePrint={handlePrint}
        isPrinting={isPrinting}
        watch={watch}
      />
    </>
  );
}
