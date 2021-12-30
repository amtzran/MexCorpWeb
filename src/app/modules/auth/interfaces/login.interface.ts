export interface Login {
  access_token:  string;
  token_type: string;
  message: string;
  error: Error[]
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
  access:  string,
  name?: string
}

export interface Error {
  title: string;
  detail: string;
}
