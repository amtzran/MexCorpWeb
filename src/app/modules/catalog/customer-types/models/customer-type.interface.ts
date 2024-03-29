// DataSource for Customer Type
import {Links, MetaModel} from "../../../../shared/interfaces/shared.interface";

export interface ModelCustomerType {
  meta: MetaModel;
  next: Links["next"];
  previous: Links["prev"];
  data: CustomerType[];
}

export interface CustomerType {
  id?: number;
  name: string;
  description: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

// Data Paginate
export interface CustomerTypePaginate {
  page: string,
  page_size: string
}

export interface CustomerTypeDetail {
  data: CustomerType
}
