import {Links} from "../../../../shared/interfaces/shared.interface";

export interface GroupModel {
  total: number;
  next?: Links["next"];
  previous?: Links["prev"];
  data: Group[];
}

export interface Group {
  id?: number,
  name: string,
  reason_social: string,
  rfc: string,
  email: string | null,
  phone: string,
  address: string,
  city: string,
  postal_code: string,
  is_active?: boolean,
  created_at?: string,
  updated_at?: string,
}

export interface GroupFilterModel {
  page: string,
  page_size: string
}

export interface GroupDetail {
  data: Group
}
