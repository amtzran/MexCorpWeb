export interface Login {
  refresh: string;
  access:  string;
}

export interface AuthResponse {
  ok?: boolean,
  uid?: string
  name?: string,
  refresh?: string;
  access?:  string;
  msg?: string
}

export interface User{
  refresh: string,
  access:  string,
  name?: string
}
