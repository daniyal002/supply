// hooks/useProductTableColumnVisibility.ts
import { useMemo } from "react";
import { IProductTable } from "@/interface/productTable";

interface ColumnVisibility {
  hasOrderProductName: boolean;
  hasOrderProductLink: boolean;
  hasOrderProductComment: boolean;
  hasBuyers: boolean;
  hasNote: boolean;
  hasIssuedQuantity?: boolean;
}

export const useProductTableColumnVisibility = (
  productTableData: IProductTable[] | undefined
): ColumnVisibility => {
  return useMemo(() => {
    if (!productTableData?.length) {
      return {
        hasOrderProductName: false,
        hasOrderProductLink: false,
        hasOrderProductComment: false,
        hasBuyers: false,
        hasNote: false,
        hasIssuedQuantity: false,
      };
    }

    return {
      hasOrderProductName: productTableData.some((p) => p.order_product_name),
      hasOrderProductLink: productTableData.some((p) => p.order_product_link),
      hasOrderProductComment: productTableData.some((p) => p.order_product_comment?.length || 0 > 0),
      hasBuyers: productTableData.some((p) => p.buyers?.length || 0 > 0),
      hasNote: productTableData.some((p) => p.note),
      hasIssuedQuantity: productTableData.some((p) => p.issued_quantity),
    };
  }, [productTableData]);
};