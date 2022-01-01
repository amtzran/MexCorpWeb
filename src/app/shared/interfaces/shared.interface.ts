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

// Profile
export interface ProfileUser {
  id?: number,
  name: string,
  new_password?: string,
  password?: string,
  password_confirmation?: string,

}
