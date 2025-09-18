import { TableProps } from "antd";
import { IProductUnit } from "./product";

type OnChange = NonNullable<TableProps<IProductUnit>["onChange"]>;
export type Filters = Parameters<OnChange>[1];

type GetSingle<T> = T extends (infer U)[] ? U : never;
export type Sorts = GetSingle<Parameters<OnChange>[2]>;