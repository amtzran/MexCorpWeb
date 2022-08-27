import {Links, MetaModel} from "../../../../shared/interfaces/shared.interface";

export interface ModelTurn {
  meta: MetaModel;
  next?: Links["next"];
  previous?: Links["prev"];
  data: Turn[];
}

export interface TurnDetail {
  data: Turn
}

export interface Turn {
  id?: number;
  name?: string;
  initial_hour?: string;
  final_hour?: string;
  key?: string;
  created_at?: Date;
  updated_at?: Date;
}

// Data Paginate
export interface turnPaginate {
  page: string,
  page_size: string,
  id?: number
}
