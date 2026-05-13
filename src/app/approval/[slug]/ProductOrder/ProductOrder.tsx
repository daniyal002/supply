import { useState } from "react";
import ProductOrderTable from "./ProductOrderTable";
import { IProductTable } from "@/interface/productTable";
import { EnumOrderTypes, IOrderItemFormValues } from "@/interface/orderItem";
import {
  UseFormGetValues,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import ModalCommentSelectProductOrder from "./ModalCommentSelectProductOrder/ModalCommentSelectProductOrder";
import ModalCommentCancelSelectProductOrder from "./ModalCommentCancelSelectProductOrder/ModalCommentCancelSelectProductOrder";
import ModalSelectProductOrder from "@/components/UI/ModalSelectProductOrder/ModalSelectProductOrder";
import Can from "@/components/Can/Can";
import { Button, message } from "antd";

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
  watch,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalOpenProduct, setIsModalOpenProduct] = useState<boolean>(false);
  const [productId, setProductId] = useState<number>();
  const [orderProductId, setOrderProductId] = useState<number>();
  const [productIndex, setProductIndex] = useState<number | null>();
  const [isNewProduct, setIsNewProduct] = useState(false);

  const [isModalOpenCancel, setIsModalOpenCancel] = useState<boolean>(false);
  const [productIdCancel, setProductIdCancel] = useState<number>();
  const [orderProductIdCancel, setOrderProductIdCancel] = useState<number>();
  const [productIndexCancel, setProductIndexCancel] = useState<number>();
  const [type, setType] = useState<"Добавить" | "Изменить">("Изменить");


  const orderId = getValues("order_id");

    // Следим за полем order_type
    const orderType = watch("order_type")
      ? watch("order_type")
      : { value: EnumOrderTypes.WAREHOUSE };

  const showModal = () => {
    setIsModalOpen(true);
  };

    const showModalProduct = () => {
    setIsModalOpenProduct(true);
    setIsNewProduct(false);
    setType("Изменить");
  };

  const showModalIsNewProduct = () => {
    setType("Добавить");
    setIsNewProduct(true);
    setProductIndex(null);
    setIsModalOpenProduct(true);
  };

  const showModalCancel = () => {
    setIsModalOpenCancel(true)
  }



  const deleteProduct = (productIndex: number) => {
    console.log(productIndex)
    const updatedProducts = getValues("order_products").filter(
      (product) => product.order_product_id !== productIndex
    );
    setValue("order_products", updatedProducts);
  };

  return (
    <>
    <ModalSelectProductOrder
        type={type}
        isModalOpen={isModalOpenProduct}
        editProductId={productIndex as number}
        productId={productId}
        setIsModalOpen={setIsModalOpenProduct}
        getValues={getValues}
        setValue={setValue}
        watch={watch}
        isNewProduct={isNewProduct}
      />
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
      { orderType.value === EnumOrderTypes.PURCHASE && (
        <Can permission="purchase_order_type_drop_down_list">
        <Can permission="update_order_partial">

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
        </Can>
        </Can>
      )}
      <ProductOrderTable
        showModal={showModal}
        showModalProduct={showModalProduct}
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
        watch={watch}
        setValue={setValue}
        getValues={getValues}
        setIsNewProduct={setIsNewProduct}
      />
    </>
  );
}
