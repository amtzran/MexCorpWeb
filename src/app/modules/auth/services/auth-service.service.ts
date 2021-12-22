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
          if (resp.access){
            localStorage.setItem('access', resp.access)
            this._user = {
              refresh: resp.refresh,
              access: resp.access,
            }
          }
        }),
        //map(resp => resp.access),
        catchError(err => of(err))
      )
  }

  // Method Validate Token
  validateToken(): Observable<boolean>{
    const headers = new HttpHeaders()
      .set('access', localStorage.getItem('access') || '')
    const url = `${this.baseUrl}/auth/token/refresh`
    return this.http.get<Login>(url, {headers: headers})
      .pipe(
        map(resp => {
          localStorage.setItem('access', resp.access)
          this._user = {
            refresh: resp.refresh,
            access: resp.access,
          }
          return true
        }),
        catchError(err => of(false))
      )
  }

  logout(){
    localStorage.clear();
  }

}
