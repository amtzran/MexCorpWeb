import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, map, Observable, of, tap} from "rxjs";
import { environment } from "../../../../environments/environment";
import {Login, User} from "../interfaces/login.interface";

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private baseUrl: string = environment.baseUrl
  private _user!: User;

  // get Data User
  get user() {
    return{...this._user}
  }

  constructor( private http: HttpClient) {}

  // Login Access
  login(email: string, password: string):Observable<Login>{
    const body = {email, password}
    return this.http.post<Login>(`${this.baseUrl}/auth/login`, body)
      .pipe(
        tap(resp => {
          if (resp.access_token){
            localStorage.setItem('access_token', resp.access_token)
            //localStorage.setItem('refresh', resp.refresh)
            this._user = {
              access: resp.access_token,
            }
          }
        }),
        catchError(err => of(err))
      )
  }

  // Method Validate Token
  validateToken(): Observable<boolean>{
    const url = `${this.baseUrl}/auth/users`
    return this.http.get<any>(url)
      .pipe(
        map(resp => {
          // If exist Email is authenticated
          return !!resp.email;
        }),
        catchError(err => of(false))
      )
  }

  logout(){
    localStorage.clear();
  }

}
