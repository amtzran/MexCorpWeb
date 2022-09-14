import {Lifting, Links, Meta} from "../../lifting/interfaces/lifting.interface";
import {Employee, JobCenter} from "../../employee/interfaces/employee.interface";
import {Supplier} from "../../catalog/suppliers/interfaces/suppliers.interface";


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
  created_at: Date;
  updated_at: Date;
}

export interface Concept {
  id:         number;
  entrie_id:  number;
  product_id: number;
  quantity:   number;
  unit_price: number;
  amount:     number;
  created_at: Date;
  updated_at: Date;
}

export interface EntryDetail {
  data: Entry
}
