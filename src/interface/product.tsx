import { IBasicUnit } from "./basicUnit";
import { IUnit } from "./unit";

export interface IProduct {
  id?: number;
  product_name: string;
  product_group: IProductGroup;
  unit_measurement: IBasicUnit;
  product_article?: string;
}

export interface IProductGroup {
  product_group_id: number;
  product_group_name: string;
}

export interface IProductGroupResponse {
  detail: IProductGroup[];
}

export interface IProductGroupOption {
  value: number;
  label: string;
}

export interface IProductUnit {
  product_id: number;
  product_name: string;
  unit_measurement: IBasicUnit;
  product_group: IProductGroup;
  directory_unit_measurement: IUnit[];
  product_article?: string;
  product_kod_1c: string;
  product_kod_1c_parent: string;
  is_group: boolean;
  remainder?: number;
  unit_measurement_name: string;
}

export interface IProductUnitNode extends IProductUnit {
  key: string;
  children?: IProductUnitNode[];
}

export interface IProductResponse {
  detail: IProductUnit[];
}

export interface IProductImage {
  file_name: string;
  file_path: string;
}

export interface IProductImageResponse {
    detail: IProductImage[]
}