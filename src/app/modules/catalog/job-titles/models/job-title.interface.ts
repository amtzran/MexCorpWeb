// DataSource for Job Title
export interface ModelJobTitle {
  count:    number;
  next:     null;
  previous: null;
  results:  JobTitle[];
}

export interface JobTitle {
  id?:            number;
  name:           string;
  description:    string;
  created_at?:    Date;
  updated_at?:    Date;
}

// Data Paginate
export interface JobTitlePaginate {
  page: string,
  page_size: string
}
