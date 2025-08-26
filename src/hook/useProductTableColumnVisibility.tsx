// hooks/useProductTableColumnVisibility.ts
import { useMemo } from "react";
import { IProductTable } from "@/interface/productTable";

interface ColumnVisibility {
  hasOrderProductName: boolean;
  hasOrderProductLink: boolean;
  hasBuyers: boolean;
  hasNote: boolean;
}

export const useProductTableColumnVisibility = (
  productTableData: IProductTable[] | undefined
): ColumnVisibility => {
  return useMemo(() => {
    if (!productTableData?.length) {
      return {
        hasOrderProductName: false,
        hasOrderProductLink: false,
        hasBuyers: false,
        hasNote: false,
      };
    }

    return {
      hasOrderProductName: productTableData.some((p) => p.order_product_name),
      hasOrderProductLink: productTableData.some((p) => p.order_product_link),
      hasBuyers: productTableData.some((p) => p.buyers?.length || 0 > 0),
      hasNote: productTableData.some((p) => p.note),
    };
  }, [productTableData]);
};