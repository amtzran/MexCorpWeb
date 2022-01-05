// DataSource for Door
import {Links, MetaModel} from "../../../../shared/interfaces/shared.interface";

export interface ModelDoor {
  meta: MetaModel;
  next?: Links["next"];
  previous?: Links["prev"];
  data: Door[];
}

export interface Door {
  id?: number;
  folio?: string;
  name: string;
  observations?: string;
  door_type_id?: number;
  door_type_name?: string;
  customer_id?: number;
  customer_name?: string;
  photo?: string | null;
  is_active?: boolean;
  report_pdf?: string;
  created_at?: Date;
  updated_at?: Date;
}

// Data Paginate
export interface DoorPaginate {
  page: string,
  page_size: string
}

export interface DoorDetail {
  data: Door
}

export interface DoorDetailTask {
  data: Door[]
}

// DataSource Type Door
export interface ModelDoorType {
  total: number;
  next?: Links["next"];
  previous?: Links["prev"];
  data: DoorType[];
}

export interface DoorType {
  id?: number;
  name: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}
