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

// Profile
export interface ProfileUser {
  id?: number,
  name: string,
  email?: string,
  email_verified_at?: string,
  created_at?: string,
  updated_at?: string
}

export interface ChangePassword {
  email?: string,
  current_password: string,
  new_password: string
}

export interface MessagePassword {
  message: string
}
