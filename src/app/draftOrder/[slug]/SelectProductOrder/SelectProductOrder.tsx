import { useEffect, useState } from "react";
import ModalSelectProductOrder from "./ModalSelectProductOrder/ModalSelectProductOrder";
import { IProductUnit } from "@/interface/product";
import SelectProductOrderTableColumn from "./SelectProductOrderTable";
import { useProductData } from "@/hook/productHook";
import {
  UseFormGetValues,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { IOrderItemFormValues } from "@/interface/orderItem";

interface Props {
  watch: UseFormWatch<IOrderItemFormValues>;
  getValues: UseFormGetValues<IOrderItemFormValues>;
  setValue: UseFormSetValue<IOrderItemFormValues>;
}

export default function SelectProductOrder({
  watch,
  getValues,
  setValue,
}: Props) {
  const { productData } = useProductData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productId, setProductId] = useState<number>();
  const productGroup = watch("product_group");
  const [filterProductData, setFilterProductData] = useState<IProductUnit[]>(
    productData as IProductUnit[]
  );

  const showModal = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    const filteredProductDataInGroup = productData?.filter(
      (product) =>
        product.product_group.product_group_id ===
        getValues("product_group.value")
    );
    const filteredProductDataNoGroup = productData?.filter(
      (product) =>
        product.product_group.product_group_id !==
        getValues("product_group.value")
    );

    const finalfilteredProductData = [
      ...(filteredProductDataInGroup || []),
      ...(filteredProductDataNoGroup || []),
    ];

    if (finalfilteredProductData) {
      setFilterProductData(finalfilteredProductData);
    } else {
      setFilterProductData([]);
    }
  }, [productData, productGroup]);
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
        isNewProduct={false}
      />
      <SelectProductOrderTableColumn
        productData={filterProductData ? filterProductData : []}
        setProductId={setProductId}
        showModal={showModal}
        getValues={getValues}
      />
    </>
  );
}
