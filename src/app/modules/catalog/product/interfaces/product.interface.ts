// DataSource for Contract
import {Links, MetaModel} from "../../../../shared/interfaces/shared.interface";

export interface ModelProduct {
  meta: MetaModel;
  next?: Links["next"];
  previous?: Links["prev"];
  data: Product[];
}

export interface Product {
  id?: number;
  name: string;
  description: string;
  brand?: string;
  cost?: string;
  photo?: string;
  created_at?: Date;
  updated_at?: Date;
}

// Data Paginate
export interface ProductPaginate {
  page: string,
  page_size: string
}

export interface ProductDetail {
  data: Product
}

// List Products
export interface ModelProduct {
  data: Product[]
}
