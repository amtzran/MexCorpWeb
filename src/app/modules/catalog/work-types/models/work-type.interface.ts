// DataSource for Work Type
import {Links, MetaModel} from "../../../../shared/interfaces/shared.interface";

export interface ModelWorkType {
  meta: MetaModel;
  next?: Links["next"];
  previous?: Links["prev"];
  data: WorkType[];
}

export interface WorkType {
  id?: number;
  name: string;
  description?: string;
  is_active?: boolean;
  cost_one?: number;
  cost_two?: number;
  delivery_certificate?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

// Data Paginate
export interface WorkTypePaginate {
  page: string,
  page_size: string
}

export interface WorkTypeDetail {
  data: WorkType
}
