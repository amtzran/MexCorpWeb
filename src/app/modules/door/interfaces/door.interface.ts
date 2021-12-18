// DataSource for Door
export interface ModelDoor {
  count:    number;
  next:     null;
  previous: null;
  results:  Door[];
}

export interface Door {
  id?:             number;
  folio?:          string;
  name:            string;
  observations?:   string;
  door_type:       number;
  customer?:       number;
  created_at?:  Date;
  updated_at?:  Date;
}

// Data Paginate
export interface DoorPaginate {
  page: string,
  page_size: string
}

// DataSource Type Door
export interface ModelDoorType {
  count:    number;
  next:     null;
  previous: null;
  results:  DoorType[];
}

export interface DoorType {
  id?:          number;
  name:        string;
  description: string;
  created_at?:  Date;
  updated_at?:  Date;
}
