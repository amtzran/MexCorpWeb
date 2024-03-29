import {Links, MetaModel} from "../../../../shared/interfaces/shared.interface";

export interface GroupModel {
  meta: MetaModel;
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
  logo?: string,
  is_active?: boolean,
  latitude?: number,
  longitude?: number,
  radius?: number,
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
