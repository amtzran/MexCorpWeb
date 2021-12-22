// DataSource for Work Type
export interface ModelWorkType {
  count:    number;
  next:     null;
  previous: null;
  results:  WorkType[];
}

export interface WorkType {
  id?:            number;
  name:           string;
  description:    string;
  created_at?:    Date;
  updated_at?:    Date;
}

// Data Paginate
export interface WorkTypePaginate {
  page: string,
  page_size: string
}
