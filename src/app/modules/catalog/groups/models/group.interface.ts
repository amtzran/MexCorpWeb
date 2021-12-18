export interface GroupModel {
  count: number;
  next?: any;
  previous?: any;
  results: Group[];
}

export interface Group {
  id?: number,
  name: string,
  reason_social: string,
  rfc: string,
  phone: string,
  email: any,
  address: any,
  city: any,
  postal_code: string,
  created_at?: string,
  updated_at?: string,
}

export interface GroupFilterModel {
  page: string,
  page_size: string
}
