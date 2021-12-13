export interface Customer {
  count:    number;
  next:     null;
  previous: null;
  results:  Result[];
}

export interface Result {
  id:            number;
  name:          string;
  reason_social: string;
  rfc:           string;
  phone:         string;
  email:         string;
  address:       string;
  city:          string;
  postal_code:   string;
  created_at:    Date;
  updated_at:    Date;
}
