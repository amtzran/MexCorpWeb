// DataSource for Comment
import {Links} from "../../../../shared/interfaces/shared.interface";

export interface ModelComment {
  total: number;
  next?: Links["next"];
  previous?: Links["prev"];
  data: CommentCustomer[];
}

export interface CommentCustomer {
  id?: number;
  comment: string;
  customer_id?: number;
  customer_name?: string;
  user_id?: number;
  user_name?: string;
  created_at?: Date;
  updated_at?: Date;
}

// Data Paginate
export interface CommentPaginate {
  page: string,
  page_size: string
}

export interface CommentCustomerDetail {
  data: CommentCustomer
}
