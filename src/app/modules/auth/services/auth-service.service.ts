import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import {Login} from "../interfaces/login.interface";

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor( private http: HttpClient) {}

  private baseUrl: string = environment.baseUrl

  // Login Access
  login(data: Login):Observable<Login>{
    return this.http.post<Login>(`${this.baseUrl}/auth/login/`, data)
  }

}
