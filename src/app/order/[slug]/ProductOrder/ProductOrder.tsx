import { useEffect, useState } from "react";
import ProductOrderTable from "./ProductOrderTable";
import { IProductTable } from "@/interface/productTable";
import ModalSelectProductOrder from "../SelectProductOrder/ModalSelectProductOrder/ModalSelectProductOrder";
import { IOrderItemFormValues } from "@/interface/orderItem";
import { UseFormGetValues, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { Button } from "antd";

interface Props {
  productTableData:IProductTable[];
  watch: UseFormWatch<IOrderItemFormValues>;
  getValues:UseFormGetValues<IOrderItemFormValues>;
  setValue:UseFormSetValue<IOrderItemFormValues>
}

export default function ProductOrder({productTableData,getValues,setValue,watch}:Props) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [productId, setProductId] = useState<number>();
  const [productIndex,setProductIndex] = useState<number | null>()
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [type, setType] = useState<"Добавить" | "Изменить">("Изменить")


  const showModal = () => {
    setIsModalOpen(true);
    setIsNewProduct(false)
    setType('Изменить')
  };

  const showModalIsNewProduct = () => {
    setType('Добавить')
    setIsNewProduct(true)
    setProductIndex(null)
    setIsModalOpen(true);
  };
  const deleteProduct = (productIndex:number) => {
    const updatedProducts = getValues("order_products").filter((_, index) => index !== productIndex);
    setValue("order_products", updatedProducts);
  }


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
      <Button onClick={() => showModalIsNewProduct()} style={{width:"100%", marginBottom:"10px"}}>Добавить новый товар</Button>
      <ProductOrderTable showModal={showModal} productTableData={productTableData} setProductId={setProductId} setProductIndex={setProductIndex} deleteProduct={deleteProduct} setIsNewProduct={setIsNewProduct}/>
    </>
  );
}
