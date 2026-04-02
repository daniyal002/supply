import { useEffect, useState } from "react";
import ModalSelectProductOrder from "@/components/UI/ModalSelectProductOrder/ModalSelectProductOrder";
import { IProductUnit } from "@/interface/product";
import SelectProductOrderTableColumn from "./SelectProductOrderTable";
import { useProductData } from "@/hook/productHook";
import {
  UseFormGetValues,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { IOrderItemFormValues } from "@/interface/orderItem";
import { Modal } from "antd";
import ProductSidebarTable from "@/components/ProductSidebarTable/ProductSidebarTable";
import { getSelectProductTableColumns } from "@/components/ProductTableColumns/SelectProductTableColumns";
import { useColumnFilterShortcut } from "@/helper/TableFilters/hook/useColumnFilterShortcut";
import { Filters, Sorts } from "@/interface/tableType";
import { useSearch } from "@/helper/TableFilters/hook/useSearch";

interface Props {
  watch: UseFormWatch<IOrderItemFormValues>;
  getValues: UseFormGetValues<IOrderItemFormValues>;
  setValue: UseFormSetValue<IOrderItemFormValues>;
  setToggle: (toggle: boolean) => void;
  toggle: boolean;
}

export default function SelectProductOrder({
  watch,
  getValues,
  setValue,
  toggle,
  setToggle,
}: Props) {
  const { productData, refetch } = useProductData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productId, setProductId] = useState<number>();
  const productGroup = watch("product_group");
  const [filterProductData, setFilterProductData] = useState<IProductUnit[]>(
    productData as IProductUnit[]
  );

  const showModal = () => {
    setIsModalOpen(true);
  };

  const { visibleColumnKey, setVisibleColumnKey } =
    useColumnFilterShortcut("product_name");

  useEffect(() => {
    const filteredProductDataInGroup = productData?.filter(
      (product) =>
        product.product_group.product_group_id ===
        getValues("product_group.value")
    );


    const finalfilteredProductData = [
      ...(filteredProductDataInGroup || []),

    ];

    if (finalfilteredProductData) {
      setFilterProductData(finalfilteredProductData);
    } else {
      setFilterProductData([]);
    }
  }, [productData, productGroup]);

  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});
  const [countProduct, setCountProduct] = useState<number>(productData?.length ?? 0);

  const { searchText, searchedColumn, searchInput, handleSearch, handleReset, resetSearch } =
        useSearch();

  const columns = getSelectProductTableColumns({
    filteredInfo,
    sortedInfo,
    data: filterProductData ?? [],
    showModal,
    setProductId,
    visibleColumnKey,
    setVisibleColumnKey,
    handleReset,
    handleSearch,
    searchInput,
    searchText,
    searchedColumn,
  });

  return (
    <>
      <Modal
        title={
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              padding: "15px 10px",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <p style={{ fontSize: "20px" }}>Выбор товара</p>
            <p>Выбранная категория: {productGroup?.label}</p>
          </div>
        }
        open={toggle}
        onCancel={() => setToggle(!toggle)}
        maskClosable={false}
        mask
        width={"100%"}
        centered
        footer={null}
      >
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
        <ProductSidebarTable
        filteredInfo={filteredInfo}
          productData={filterProductData ?? []}
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
            <SelectProductOrderTableColumn
            onChange={(p, f, s, e) => {
              setFilteredInfo(f);
              setSortedInfo(s as any);
            }}
              productData={filteredProducts} // <-- используем уже отфильтрованные продукты
              setProductId={setProductId}
              showModal={showModal}
              getValues={getValues}
              refetch={refetch}
              watch={watch}
              expandedRowKeys={expandedRowKeys} // если твоя таблица поддерживает expandable rows
              setExpandedRowKeys={setExpandedRowKeys}
              currentFilters={countProduct} // например, для отображения количества фильтрованных продуктов
              clearAll={clearAll}
              columns={columns} // кнопка очистки
            />
          )}
        </ProductSidebarTable>
      </Modal>
    </>
  );
}
