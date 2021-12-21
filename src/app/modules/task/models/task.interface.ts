export interface ModelTask {
  count:    number;
  next:     null;
  previous: null;
  results:  Task[];
}

export interface Task {
  id:           number;
  folio:        string;
  title:        string;
  job_center:   number;
  customer:     number;
  employee:     number;
  initial_date: string;
  final_date:   string;
  initial_hour: string;
  final_hour:   string;
  comments:     null | string;
}

export interface Event {
  id: string,
  title: string,
  start: string,
  end: string
}

// DataSource Work Types
export interface ModelWorkType {
  count:    number;
  next:     null;
  previous: null;
  results:  WorkType[];
}

export interface WorkType {
  id?:          number;
  name:        string;
  description?: string;
  created_at?:  Date;
  updated_at?:  Date;
}

