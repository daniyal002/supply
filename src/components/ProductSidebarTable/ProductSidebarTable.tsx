"use client";

import { useEffect, useMemo, useState } from "react";
import { IProductUnit } from "@/interface/product";
import { ProductFolderSidebar } from "./ProductFolderSidebar";
import { Filters, Sorts } from "@/interface/tableType";
import { matchesSearch } from "@/helper/TableFilters/Filters/filterBySearchText";
import { useSearch } from "@/helper/TableFilters/hook/useSearch";

const filterFieldMap: Record<string, string> = {
  product_group: "product_group_name",
  directory_unit_measurement: "unit_measurement.unit_measurement_id",
};

interface ProductSidebarTableProps {
  productData: IProductUnit[];
  setFilteredInfo: (f: Filters) => void;
  filteredInfo: Filters; // <-- добавляем
  setSortedInfo: (s: Sorts) => void;
  setCountProduct: (c: number) => void;
  resetSearch: () => void
  children: (args: {
    filteredProducts: IProductUnit[];
    expandedRowKeys: string[];
    setExpandedRowKeys: (keys: string[]) => void;
    clearAll: () => void;
  }) => React.ReactNode;
}

const ProductSidebarTable: React.FC<ProductSidebarTableProps> = ({
  productData,
  children,
  setFilteredInfo,
  setSortedInfo,
  setCountProduct,
  filteredInfo,
  resetSearch
}) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const [selectedFolderKeys, setSelectedFolderKeys] = useState<string[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);



  const folderTree = useMemo(() => {
    const map: Record<string, any> = {};
    const roots: any[] = [];

    productData.forEach((item) => {
      if (item.is_group)
        map[item.product_kod_1c] = {
          title: item.product_name,
          key: item.product_kod_1c,
          children: [],
        };
    });

    productData.forEach((item) => {
      if (item.is_group) {
        if (!item.product_kod_1c_parent) roots.push(map[item.product_kod_1c]);
        else {
          const parent = map[item.product_kod_1c_parent];
          if (parent) parent.children.push(map[item.product_kod_1c]);
        }
      }
    });

    roots.unshift({ title: "Без папки", key: "no-parent", children: [] });
    return roots;
  }, [productData]);

  const filteredProducts = useMemo(() => {
    if (!selectedFolderKeys.length)
      return productData.filter((p) => !p.is_group);

    const result: IProductUnit[] = [];
    const addChildren = (parentKey: string) => {
      if (parentKey === "no-parent") {
        productData.forEach((p) => {
          if (!p.is_group && !p.product_kod_1c_parent) result.push(p);
        });
        return;
      }
      productData.forEach((p) => {
        if (p.product_kod_1c_parent === parentKey) {
          if (!p.is_group) result.push(p);
          else addChildren(p.product_kod_1c);
        }
      });
    };

    selectedFolderKeys.forEach((key) => addChildren(key));
    return result;
  }, [selectedFolderKeys, productData]);

  function getNestedValue(obj: any, path: string): any {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
  }

  const visibleProducts = useMemo(() => {
    let products = filteredProducts;

    Object.entries(filteredInfo || {}).forEach(([key, values]) => {
      if (!values || !Array.isArray(values) || values.length === 0) return;

      products = products.filter((p) => {
        let cell: any = p[key as keyof IProductUnit];

        if (key === "directory_unit_measurement" && Array.isArray(cell)) {
          const mainUnit = cell.find((u) => u.coefficient > 1) || cell[0];
          cell = getNestedValue(mainUnit, "unit_measurement.unit_measurement_id");
        } else if (cell && typeof cell === "object" && filterFieldMap[key]) {
          cell = getNestedValue(cell, filterFieldMap[key]);
        }

        return values.some((v) => {
          // Если число — сравниваем как число
          if (!isNaN(Number(v)) && !isNaN(Number(cell))) {
            return Number(cell) === Number(v);
          }
          // Если строка — ищем вхождение
          return values.some((v) => matchesSearch(cell, v as string));
        });
      });
    });

    return products;
  }, [filteredProducts, filteredInfo]);


  useEffect(() => {
    setCountProduct(visibleProducts.length);
  }, [visibleProducts]);

  // Очистка фильтров
  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
    setSelectedFolderKeys([]);
    setExpandedRowKeys([]);
    setCountProduct(0);
    resetSearch();
  };

  return (
    <div>
      <ProductFolderSidebar
        folderTree={folderTree}
        productData={productData}
        selectedFolderKeys={selectedFolderKeys}
        setSelectedFolderKeys={setSelectedFolderKeys}
        drawerVisible={drawerVisible}
        setDrawerVisible={setDrawerVisible}
      />

        {children({
          filteredProducts: visibleProducts,
          expandedRowKeys,
          setExpandedRowKeys,
          clearAll,
        })}
      </div>
  );
};

export default ProductSidebarTable;
