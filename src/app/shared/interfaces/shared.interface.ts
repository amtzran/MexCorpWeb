/**
 * Interface Component Delete general
 */
export interface MessageDelete {
  id?:    number;
  name:     string;
}

// Pagination
export interface Links {
  first?: string,
  last?: string,
  prev?: string,
  next?: string
}

// Pagination
export interface MetaModel {
  total: number
}

export interface Permission {
  data: DataPermission[]
}

export interface DataPermission {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string
}

// Data Paginate
export interface paginateGeneral {
  page: string,
  page_size: string,
  id?: number | string,
  door_id?: number,
  employee?: number,
  group?: number,
  initial_date?: string,
  final_date?: string
}

