// DataSource for Door Type
export interface ModelDoorType {
  count:    number;
  next:     null;
  previous: null;
  results:  DoorType[];
}

export interface DoorType {
  id?:            number;
  name:           string;
  description:    string;
  created_at?:    Date;
  updated_at?:    Date;
}

// Data Paginate
export interface DoorTypePaginate {
  page: string,
  page_size: string
}
