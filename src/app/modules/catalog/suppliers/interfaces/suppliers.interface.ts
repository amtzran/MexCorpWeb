// DataSource for Contract
import {Links, MetaModel} from "../../../../shared/interfaces/shared.interface";

export interface ModelSupplier {
  meta: MetaModel;
  next?: Links["next"];
  previous?: Links["prev"];
  data: Supplier[];
}

export interface Supplier {
  id?: number;
  name: string;
  created_at?: Date;
  updated_at?: Date;
}

// Data Paginate
export interface SupplierPaginate {
  page: string,
  page_size: string
}

export interface SupplierDetail {
  data: Supplier
}
