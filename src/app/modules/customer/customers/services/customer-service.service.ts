import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {Observable, switchMap} from "rxjs";
import {
  Customer, CustomerDetail,
  CustomerPaginate,
  ModelContract, ModelCustomer, ModelTypeCustomer,
} from "../interfaces/customer.interface";

@Injectable({
  providedIn: 'root'
})
export class CustomerServiceService {

  constructor( private http: HttpClient) {}

  private baseUrl: string = environment.baseUrl

  // Get Customers
  getCustomers(filter: CustomerPaginate): Observable<ModelCustomer> {
    let params = new HttpParams();
    filter.page ? params = params.append('page', filter.page) : null;
    filter.page_size ? params = params.append('page_size', filter.page_size) : null;
    return this.http.get<ModelCustomer>(`${this.baseUrl}/customers/`, {params})
  }

  // Add Customer
  addCustomer(customer: CustomerDetail): Observable<CustomerDetail> {
    return this.http.post<CustomerDetail>(`${this.baseUrl}/customers/`, customer)
  }

  // Update Customer
  updateCustomer(customerId: number, customer: CustomerDetail) : Observable<CustomerDetail> {
    return this.http.put<CustomerDetail>(`${this.baseUrl}/customers/${customerId}/`,customer)
  }

  // Get Customer
  getCustomerById(id: number) : Observable<CustomerDetail> {
    return this.http.get<CustomerDetail>(`${this.baseUrl}/customers/${id}`)
  }

  // DeleteCustomer
  deleteCustomer(id: number) : Observable<number>{
    return this.http.delete<number>(`${this.baseUrl}/customers/${id}`)
  }

  // Get Contracts
  getContracts() : Observable<ModelContract> {
    return this.http.get<ModelContract>(`${this.baseUrl}/contracts/`)
  }

  // Get Type Customer
  getTypeCustomers() : Observable<ModelTypeCustomer> {
    return this.http.get<ModelTypeCustomer>(`${this.baseUrl}/customer-types/`)
  }

}
