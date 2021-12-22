// DataSource for Customer
export interface ModelCustomer {
  count:    number;
  next:     null;
  previous: null;
  results:  Customer[];
}

export interface Customer {
  id?:            number;
  name:           string;
  reason_social?: string;
  rfc?:           string;
  phone?:         string;
  email?:         string;
  address?:       string;
  city?:          string;
  postal_code?:   string;
  contract:       number;
  customer_type:  number;
  user?:          number;
  created_at?:    Date;
  updated_at?:    Date;
}

export interface CustomerPaginate {
  page: string,
  page_size: string
}

// DataSource Contract
export interface ModelContract {
  count:    number;
  next:     null;
  previous: null;
  results:  Contract[];
}

export interface Contract {
  id?:          number;
  name:        string;
  description: string;
  created_at?:  Date;
  updated_at?:  Date;
}

// DataSource Type Customers
export interface ModelTypeCustomer {
  count:    number;
  next:     null;
  previous: null;
  results:  TypeCustomer[];
}

export interface TypeCustomer {
  id?:          number;
  name:        string;
  description?: string;
  created_at?:  Date;
  updated_at?:  Date;
}

