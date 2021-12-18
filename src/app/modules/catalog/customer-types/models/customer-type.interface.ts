// DataSource for Customer Type
export interface ModelCustomerType {
  count:    number;
  next:     null;
  previous: null;
  results:  CustomerType[];
}

export interface CustomerType {
  id?:            number;
  name:           string;
  description:          string;
  created_at?:    Date;
  updated_at?:    Date;
}

// Data Paginate
export interface CustomerTypePaginate {
  page: string,
  page_size: string
}
