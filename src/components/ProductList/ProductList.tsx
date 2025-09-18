import { useProductData } from "@/hook/productHook";
import ProductSidebarTable from "../ProductSidebarTable/ProductSidebarTable";
import { useEffect, useState } from "react";
import { ProductTable } from "../ProductSidebarTable/ProductTable";
import { Filters, Sorts } from "@/interface/tableType";
import { useSearch } from "@/helper/TableFilters/hook/useSearch";
import { getProductTableColumns } from "../ProductTableColumns/ProductTableColumns";

export default function ProductList() {
  const { productData, refetch } = useProductData();

  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});
  const [countProduct, setCountProduct] = useState<number>(
    productData?.length ?? 0
  );

  const {
    searchText,
    searchedColumn,
    searchInput,
    handleSearch,
    handleReset,
    resetSearch,
  } = useSearch();

  const columns = getProductTableColumns({
    data: productData ?? [],
    filteredInfo,
    sortedInfo,
    handleReset,
    handleSearch,
    searchInput,
    searchText,
    searchedColumn,
  });

  return (
    <ProductSidebarTable
      filteredInfo={filteredInfo}
      productData={productData ?? []}
      setFilteredInfo={setFilteredInfo}
      setSortedInfo={setSortedInfo}
      setCountProduct={setCountProduct}
      resetSearch={resetSearch}
    >
      {({
        filteredProducts,
        expandedRowKeys,
        setExpandedRowKeys,
        clearAll,
      }) => (
        <ProductTable
          data={filteredProducts}
          onChange={(p, f, s, e) => {
            setFilteredInfo(f);
            setSortedInfo(s as any);
            setCountProduct(e.currentDataSource.length);
          }}
          refetch={refetch}
          expandedRowKeys={expandedRowKeys}
          setExpandedRowKeys={setExpandedRowKeys}
          currentFilters={countProduct ?? 0}
          clearAll={clearAll}
          columns={columns}
        />
      )}
    </ProductSidebarTable>
  );
}
