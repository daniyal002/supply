import { useState } from "react";
import ProductOrderTable from "./ProductOrderTable";
import { IProductTable } from "@/interface/productTable";
import ModalSelectProductOrder from "../SelectProductOrder/ModalSelectProductOrder/ModalSelectProductOrder";
import { IOrderItemFormValues } from "@/interface/orderItem";
import { UseFormGetValues, UseFormSetValue, UseFormWatch } from "react-hook-form";

interface Props {
  productTableData:IProductTable[];
  watch: UseFormWatch<IOrderItemFormValues>;
  getValues:UseFormGetValues<IOrderItemFormValues>;
  setValue:UseFormSetValue<IOrderItemFormValues>
}

export default function ProductOrder({productTableData,getValues,setValue,watch}:Props) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [productId, setProductId] = useState<number>();
  const [productIndex,setProductIndex] = useState<number>()

  const showModal = () => {
    setIsModalOpen(true);
  };

  const deleteProduct = (productIndex:number) => {
    const updatedProducts = getValues("products").filter((_, index) => index !== productIndex);
    setValue("products", updatedProducts);
  }

  return (
    <>
      <ModalSelectProductOrder
        type="Изменить"
        isModalOpen={isModalOpen}
       editProductId={productIndex as number}
       productId={productId}
       setIsModalOpen={setIsModalOpen}
       getValues={getValues}
       setValue={setValue}
       watch={watch}
      />
      <ProductOrderTable showModal={showModal} productTableData={productTableData} setProductId={setProductId} setProductIndex={setProductIndex} deleteProduct={deleteProduct}/>
    </>
  );
}
