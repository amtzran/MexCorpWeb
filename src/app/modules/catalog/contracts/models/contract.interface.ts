// DataSource for Contract
export interface ModelContract {
  count:    number;
  next:     null;
  previous: null;
  results:  Contract[];
}

export interface Contract {
  id?:            number;
  name:           string;
  description:          string;
  created_at?:    Date;
  updated_at?:    Date;
}

// Data Paginate
export interface ContractPaginate {
  page: string,
  page_size: string
}
