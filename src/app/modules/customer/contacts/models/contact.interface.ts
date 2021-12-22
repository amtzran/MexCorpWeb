// DataSource for Contact
export interface ModelContact {
  count:    number;
  next:     null;
  previous: null;
  results:  Contact[];
}

export interface Contact {
  id?:            number;
  name:           string;
  phone:          string;
  email:          string;
  customer?:       number;
  created_at?:    Date;
  updated_at?:    Date;
}

// Data Paginate
export interface ContactPaginate {
  page: string,
  page_size: string
}
