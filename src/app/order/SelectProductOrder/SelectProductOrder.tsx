import { useState } from "react";
import ModalSelectProductOrder from "./ModalSelectProductOrder/ModalSelectProductOrder";
import { IProductUnit } from "@/interface/product";
import SelectProductOrderTableColumn from "./SelectProductOrderTable";
import { useProductData } from "@/hook/productHook";
import { UseFormGetValues, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { IOrderItemFormValues } from "@/interface/orderItem";


interface Props{
  watch: UseFormWatch<IOrderItemFormValues>;
  getValues:UseFormGetValues<IOrderItemFormValues>;
  setValue:UseFormSetValue<IOrderItemFormValues>

}

export default function SelectProductOrder({watch,getValues,setValue}:Props) {
  const { productData } = useProductData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productId, setProductId] = useState<number>();


  const showModal = () => {
    setIsModalOpen(true);
  };



  return (
    <>
      <ModalSelectProductOrder
        type="Добавить"
        setIsModalOpen={setIsModalOpen}
        isModalOpen={isModalOpen}
        productId={productId}
        watch={watch}
        getValues={getValues}
        setValue={setValue}
        editProductId={null}
      />
      <SelectProductOrderTableColumn productData={productData} setProductId={setProductId} showModal={showModal}/>
    </>
  );
}
