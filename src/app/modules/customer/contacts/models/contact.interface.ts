// DataSource for Contact
import {Links, MetaModel} from "../../../../shared/interfaces/shared.interface";

export interface ModelContact {
  meta: MetaModel;
  next?: Links["next"];
  previous?: Links["prev"];
  data: Contact[];
}

export interface Contact {
  id?: number;
  name: string;
  phone: string;
  email?: string | null;
  department?: string;
  job_title?: string
  customer_id?: number;
  customer_name?: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

// Data Paginate
export interface ContactPaginate {
  page: string,
  page_size: string
}

export interface ContactDetail {
  data: Contact
}
