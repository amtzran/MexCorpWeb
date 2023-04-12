import {Links, Meta} from "../../lifting/interfaces/lifting.interface";
import {Employee, JobCenter} from "../../employee/interfaces/employee.interface";
import {Supplier} from "../../catalog/suppliers/interfaces/suppliers.interface";
import {MetaModel} from "../../../shared/interfaces/shared.interface";


export interface EntryPaginate {
  page: string,
  page_size: string,
  supplier?: number,
  employee?: string | number,
  group?: string | number,
  initial_date?: string,
  final_date?: string,
}

export interface ConceptPaginate {
  page: string,
  page_size: string,
  entrie_id: string
}

export interface ModelEntry {
  data:  Entry[];
  links: Links;
  meta:  Meta;
}

export interface ModelConcept {
  data:  Concept[];
  links: Links;
  meta:  Meta;
}

export interface Entry {
  id:         number;
  supplier:   Supplier;
  job_center: JobCenter;
  employee:   Employee;
  concepts:   Concept[];
  total:      number;
  comments: string;
  created_at: Date;
  updated_at: Date;
}

export interface Concept {
  id:         number;
  entrie_id:  number;
  product_id: number;
  product_name: string;
  quantity:   number;
  unit_price: number;
  amount:     number;
  created_at: Date;
  updated_at: Date;
}

export interface EntryDetail {
  data: Entry
}

export interface ConceptDetail {
  data: Concept
}

export interface StockPaginate {
  page: string,
  page_size: string,
  warehouse?: string | number,
  supplier?: string | number,
  product?: string | number,
  employee?: string | number,
  origin?: string | number,
  destiny?: string | number,
  movement?: string | number,
  group?: string | number,
  initial_date?: string,
  final_date?: string,
}

export interface ModelWarehouse {
  meta: MetaModel;
  next?: Links["next"];
  previous?: Links["prev"];
  data: Warehouse[];
}

export interface Warehouse {
  id: number
  name: string,
  type: string,
  created_at: string,
  updated_at: string
}

export interface ModelWarehouseInventory {
  data:  Warehouse[];
  links: Links;
  meta:  Meta;
}

export interface ModelMovement {
  data:  Movement[];
  links: Links;
  meta:  Meta;
}

export interface Movement {
  id:            number;
  movement:      string;
  employee_id:   number;
  employee_name: string;
  origin_id:     number;
  origin_name:   string;
  destiny_id:    number;
  destiny_name:  string;
  product_id:    number;
  product_name:  string;
  quantity:      string;
  created_at:    Date | string;
  updated_at:    Date | string;
}
