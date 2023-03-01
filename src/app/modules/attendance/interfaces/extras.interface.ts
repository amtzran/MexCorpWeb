import {Links, MetaModel} from "../../../shared/interfaces/shared.interface";

export interface ModelExtras {
  meta: MetaModel;
  next?: Links["next"];
  previous?: Links["prev"];
  data: Extras[];
}

export interface Extras {
  employee_id:          number;
  start_date:           string;
  end_date:             string;
  start_hour:           string;
  end_hour:             string;
  start_latitude:       number;
  start_longitude:      number;
  end_latitude:         number;
  end_longitude:        number;
  created_at?: Date;
  updated_at?: Date;
}
