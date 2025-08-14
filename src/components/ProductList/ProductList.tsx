import ProductListTable from "./ProductListTable";
import { useProductData } from "@/hook/productHook";

export default function ProductList() {
  const { productData, refetch } = useProductData();
  return (
    <>
      <ProductListTable
        productData={productData ? productData : []}
        refetch={refetch}
      />
    </>

  );
}
