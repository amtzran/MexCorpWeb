// DataSource for Product
import {Links, MetaModel} from "../../../../shared/interfaces/shared.interface";

export interface ModelProduct {
  meta: MetaModel;
  next?: Links["next"];
  previous?: Links["prev"];
  data: Product[];
}

export interface Product {
  id?: number;
  name?: string;
  description?: string;
  brand?: string;
  cost?: string;
  photo?: string;
  quantity?: number;
  unit?: string;
  key?: string;
  model?: string;
  family?: string;
  location?: string;
  created_at?: Date;
  updated_at?: Date;
}

// Data Paginate
export interface ProductPaginate {
  page: string,
  page_size: string,
  id?: number,
  category?: string,
  brand?: string,
  description?: string
}

export interface ProductDetail {
  data: Product
}

// List Products
export interface ModelProduct {
  data: Product[]
}
