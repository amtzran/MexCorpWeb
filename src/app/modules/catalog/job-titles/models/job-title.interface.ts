// DataSource for Job Title
import {Links, MetaModel} from "../../../../shared/interfaces/shared.interface";

export interface ModelJobTitle {
  meta: MetaModel;
  next: Links["next"];
  previous: Links["prev"];
  data: JobTitle[];
}

export interface JobTitle {
  id?: number;
  name: string;
  description: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

// Data Paginate
export interface JobTitlePaginate {
  page: string,
  page_size: string
}

export interface JobTitleDetail {
  data: JobTitle
}
