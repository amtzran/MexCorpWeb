// DataSource for Work Type
import {Links} from "../../../../shared/interfaces/shared.interface";

export interface ModelWorkType {
  total: number;
  next?: Links["next"];
  previous?: Links["prev"];
  data: WorkType[];
}

export interface WorkType {
  id?: number;
  name: string;
  description: string;
  is_active?: boolean;
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
