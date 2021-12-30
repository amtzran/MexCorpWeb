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
