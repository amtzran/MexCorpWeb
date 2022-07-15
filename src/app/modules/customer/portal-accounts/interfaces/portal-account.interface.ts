// DataSource for Contact
import {Links, MetaModel} from "../../../../shared/interfaces/shared.interface";

export interface ModelPortalAccount {
  meta: MetaModel;
  next?: Links["next"];
  previous?: Links["prev"];
  data: PortalAccount[];
}

export interface PortalAccount {
  id?: number;
  name: string;
  username: string;
  password?: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

// Data Paginate
export interface PortalAccountPaginate {
  page: string,
  page_size: string
}

export interface PortalAccountDetail {
  data: PortalAccount
}
