import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {Customer} from "../interfaces/customer.interface";

@Injectable({
  providedIn: 'root'
})
export class CustomerServiceService {

  constructor( private http: HttpClient) {}

  private baseUrl: string = environment.baseUrl

  // Get Customers
  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.baseUrl}/customers/`)
  }

}
