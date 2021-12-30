// DataSource for Door Type
import {Links} from "../../../../shared/interfaces/shared.interface";

export interface ModelDoorType {
  total: number;
  next?: Links["next"];
  previous?: Links["prev"];
  data: DoorType[];
}

export interface DoorType {
  id?: number;
  name: string;
  description: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

// Data Paginate
export interface DoorTypePaginate {
  page: string,
  page_size: string
}

export interface DoorTypeDetail {
  data: DoorType
}
