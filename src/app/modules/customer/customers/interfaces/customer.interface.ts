// DataSource for Customer
import {Links, MetaModel} from "../../../../shared/interfaces/shared.interface";

export interface ModelCustomer {
  meta: MetaModel;
  next?: Links["next"];
  previous?: Links["prev"];
  data: Customer[];
}

export interface Customer {
  id?: number;
  name: string;
  reason_social?: string;
  rfc?: string;
  phone?: string;
  email: string | null;
  address?: string;
  city?: string;
  postal_code?: string;
  contract_id: number;
  contract_name?: string;
  customer_type_id: number;
  customer_type_name?: string;
  user_id?: number;
  user_name?: string;
  is_active?: boolean;
  date_end_agreement?: string,
  date_start_agreement?: string,
  created_at?: Date;
  updated_at?: Date;
}

// Pagination
export interface CustomerPaginate {
  page?: string,
  page_size?: string,
  customer?: string
}

export interface CustomerDetail {
  data: Customer
}

// DataSource Contract
export interface ModelContract {
  total: number;
  next: null;
  previous: null;
  data: Contract[];
}

export interface Contract {
  id?: number;
  name: string;
  description: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface ContractDetail {
  data: Contract
}

// DataSource Type Customers
export interface ModelTypeCustomer {
  total: number;
  next: null;
  previous: null;
  data: TypeCustomer[];
}

export interface TypeCustomer {
  id?: number;
  name: string;
  description?: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface CustomerTitle {
  id?: number;
  name: string;
}

export interface reportCustomer {
  type?: string;
  initial_date?: string;
  final_date?: string;
  customer?: string;
  contract?: string;
  customer_type?: string;
}

