// DataSource for Customer
import {DataPermission, Links, MetaModel} from "../../../shared/interfaces/shared.interface";
import {Product} from "../../catalog/tools-services/interfaces/product.interface";

export interface ModelEmployee {
  meta: MetaModel;
  next?: Links["next"];
  previous?: Links["prev"];
  data: Employee[];
}

export interface Employee {
  id?: number;
  name: string;
  email: string | null;
  color: string;
  job_center_id: number;
  job_center_name?: string;
  job_title_id: number;
  job_title_name?: string;
  turn_id: number;
  avatar?: string;
  signature?: string;
  is_active?: boolean;
  entry_radius?: boolean;
  exit_radius?: boolean;
  user_id?: number;
  user_name?: string;
  date_admission?: string;
  nss?: string;
  curp?: string;
  rfc?: string;
  validity?: string;
  phone?: string;
  observations: string;
  permissions_user: DataPermission[] | [];
  products_employee?: any;
  created_at?: string;
  updated_at?: string;
}

// Data Paginate
export interface EmployeePaginate {
  page: string,
  page_size: string,
  employee: string,
  job_center: string,
  job_title: string,
  turn: string,
  initial_date: string,
  final_date: string
}

export interface EmployeeDetail {
  data: Employee
}

// DataSource Job Center
export interface ModelJobCenter {
  total: number;
  next: null;
  previous: null;
  data: JobCenter[];
}

export interface JobCenter {
  id?: number;
  name: string;
  description: string;
  created_at?: Date;
  updated_at?: Date;
}

// DataSource Type Customers
export interface ModelJob {
  total: number;
  next: null;
  previous: null;
  data: Job[];
}

export interface Job {
  id?: number;
  name: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}

//Tools Employees
export interface ToolsEmployee {
  product_id?: number,
  quantity?: number
}
