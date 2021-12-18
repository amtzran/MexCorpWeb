// DataSource for Customer
export interface ModelEmployee {
  count:    number;
  next:     null;
  previous: null;
  results:  Employee[];
}

export interface Employee {
  id?:            number;
  name:           string;
  color:          string;
  job_center:     number;
  job:            number;
  user?:           number;
  avatar?:        string;
  signature?:     string;
  //created_at?:    Date;
  //updated_at?:    Date;
}

// Data Paginate
export interface EmployeePaginate {
  page: string,
  page_size: string
}

// DataSource Job Center
export interface ModelJobCenter {
  count:    number;
  next:     null;
  previous: null;
  results:  JobCenter[];
}

export interface JobCenter {
  id?:          number;
  name:        string;
  description: string;
  created_at?:  Date;
  updated_at?:  Date;
}

// DataSource Type Customers
export interface ModelJob {
  count:    number;
  next:     null;
  previous: null;
  results:  Job[];
}

export interface Job {
  id?:          number;
  name:        string;
  description?: string;
  created_at?:  Date;
  updated_at?:  Date;
}
