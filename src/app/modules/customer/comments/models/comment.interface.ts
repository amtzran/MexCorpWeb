// DataSource for Comment
export interface ModelComment {
  count:    number;
  next:     null;
  previous: null;
  results:  CommentCustomer[];
}

export interface CommentCustomer {
  id?:            number;
  comment:        string;
  customer?:      number;
  created_at?:    Date;
  updated_at?:    Date;
}

// Data Paginate
export interface CommentPaginate {
  page: string,
  page_size: string
}
