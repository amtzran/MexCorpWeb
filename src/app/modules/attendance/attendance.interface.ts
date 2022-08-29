import {Links, MetaModel} from "../../shared/interfaces/shared.interface";

export interface ModelAttendance {
  meta: MetaModel;
  next?: Links["next"];
  previous?: Links["prev"];
  data: Attendance[];
}

export interface Attendance {
  employee_id:          number;
  date:                 Date;
  start_hour:           string;
  end_hour:             string;
  start_latitude:       number;
  start_longitude:      number;
  end_latitude:         number;
  end_longitude:        number;
  start_meal_hour:      string;
  end_meal_hour:        string;
  start_meal_latitude:  number;
  start_meal_longitude: number;
  end_meal_latitude:    number;
  end_meal_longitude:   number;
  created_at?: Date;
  updated_at?: Date;
}
