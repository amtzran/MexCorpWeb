import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {
  CustomerTypeDetail,
  CustomerTypePaginate,
  ModelCustomerType
} from "../models/customer-type.interface";

@Injectable({
  providedIn: 'root'
})
export class CustomerTypeService {

  constructor( private http: HttpClient) { }
  private baseUrl: string = environment.baseUrl

  // Get Customer Type
  getCustomerTypeById(id: number) : Observable<CustomerTypeDetail> {
    return this.http.get<CustomerTypeDetail>(`${this.baseUrl}/customer-types/${id}`)
  }

  // Get Customer Types
  getCustomerTypes(filter: CustomerTypePaginate): Observable<ModelCustomerType> {
    let params = new HttpParams();
    filter.page ? params = params.append('page', filter.page) : null;
    filter.page_size ? params = params.append('page_size', filter.page_size) : null;
    return this.http.get<ModelCustomerType>(`${this.baseUrl}/customer-types/`, {params})
  }

  // Add Customer Type
  addCustomerType(customerType: CustomerTypeDetail): Observable<CustomerTypeDetail> {
    return this.http.post<CustomerTypeDetail>(`${this.baseUrl}/customer-types/`, customerType)
  }

  // Update Customer Type
  updateCustomerType(idCustomerType: number, customerType: CustomerTypeDetail) : Observable<CustomerTypeDetail> {
    return this.http.put<CustomerTypeDetail>(`${this.baseUrl}/customer-types/${idCustomerType}/`,customerType)
  }

  // Delete Customer Type
  deleteCustomerType(id: number) : Observable<number>{
    return this.http.delete<number>(`${this.baseUrl}/customer-types/${id}`)
  }

}
