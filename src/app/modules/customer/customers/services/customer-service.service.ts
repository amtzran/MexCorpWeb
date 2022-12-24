import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {Observable} from "rxjs";
import {
  CustomerDetail,
  CustomerPaginate,
  ModelContract, ModelCustomer, ModelTypeCustomer, reportCustomer,
} from "../interfaces/customer.interface";
import {DateService} from "../../../../core/utils/date.service";

@Injectable({
  providedIn: 'root'
})
export class CustomerServiceService {

  constructor(private http: HttpClient,
              private dateService: DateService) {}

  private baseUrl: string = environment.baseUrl

  // Get Customers
  getCustomers(filter: CustomerPaginate, customerForm: reportCustomer): Observable<ModelCustomer> {
    let params = new HttpParams();
    filter.page ? params = params.append('page', filter.page) : null;
    filter.page_size ? params = params.append('page_size', filter.page_size) : null;
    customerForm.customer ? params = params.append('customer', customerForm.customer) : null;
    customerForm.contract ? params = params.append('contract', customerForm.contract) : null;
    customerForm.customer_type ? params = params.append('customer_type', customerForm.customer_type) : null;
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
    let params = new HttpParams();
    params = params.append('not_paginate',true);
    return this.http.get<ModelTypeCustomer>(`${this.baseUrl}/customer-types/`, {params})
  }

  // Report Customers
  exportReportCustomer(filterCustomer: reportCustomer, type: string) : Observable<any> {
    let initial_date, final_date;
    if (filterCustomer.initial_date === '')  {
      initial_date = '';
      final_date = '';
    }
    else {
      initial_date = this.dateService.getFormatDataDate(filterCustomer.initial_date)
      final_date = this.dateService.getFormatDataDate(filterCustomer.final_date)
    }

    let customer = String(filterCustomer.customer)
    let contract = String(filterCustomer.contract)
    let customer_type = String(filterCustomer.customer_type)
    let params = new HttpParams();
    params = params.append('initial_date', initial_date);
    params = params.append('final_date', final_date);
    params = params.append('customer', customer);
    params = params.append('contract', contract);
    params = params.append('customer_type', customer_type);
    params = params.append('type', type);
    return this.http.post(`${this.baseUrl}/customers-export/`, '',{responseType: 'blob', params})
  }

}
