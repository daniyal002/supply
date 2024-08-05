import { IBasicUnit } from "@/interface/basicUnit";
import { IProduct } from "@/interface/product";
import { IProductTable, IProductTableRequest } from "@/interface/productTable";
import { IUnit } from "@/interface/unit";
import { Button, Space, Table, TableColumnsType } from "antd";


interface productOrderTableProps {
  productTableData: IProductTable[] | undefined;
  showModal: () => void,
  setProductId: (product: number) => void
  setProductIndex: (key: number) => void
  deleteProduct: (key: number) => void
}

const ProductOrderTable: React.FC<productOrderTableProps> = ({productTableData,setProductId,showModal,setProductIndex,deleteProduct}) =>{
   
  const columns: TableColumnsType<IProductTable> = [
    {
    title: "Товар",
    dataIndex: "product",
    key: "product",
    sorter: {
      compare: (a: any, b: any) =>
        a.product.product_name.localeCompare(b.product.product_name, "ru"),
    },
    render: (product: IProduct) => product?.product_name,
  },

  {
    title: "Ед. измерения",
    dataIndex: "unitProductTable",
    key: "unitProductTable",
    sorter: {
      compare: (a: any, b: any) =>
        a.unitProductTable?.unit_measurement.name.localeCompare(b.unitProductTable?.unit_measurement.name.name, "ru"),
    },
    render: (unitProductTable: IUnit) => unitProductTable?.unit_measurement.name,
    responsive: ["sm"],
  },
  {
    title: "Количество",
    dataIndex: "product_quantity",
    key: "product_quantity",
    sorter: {
      compare: (a: any, b: any) => a.count - b.count,
    },
    responsive: ["sm"],
  },
  {
    title: "Действия",
    key: "action",
    render: (record: IProductTable) => (
      <Space size="middle">
        <div>
          <Button
            onClick={() => {
              setProductId(record.product.product_id as number);
              showModal();
                    // @ts-ignore: Unreachable code error
              setProductIndex(record.key)
            }}
          >
            Изменить
          </Button>
          <Button
            onClick={() => {
                    // @ts-ignore: Unreachable code error
              deleteProduct(record.key);
            }}
          >
            Удалить
          </Button>
        </div>
      </Space>
    ),
  },
]

const dataSource = productTableData?.map((product,index) => ({
  ...product,
  key: index, // Ensure each item has a unique key
}));

return <Table dataSource={dataSource} columns={columns} />;
}
  
export default ProductOrderTable;
