import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {ModelPortalAccount, PortalAccountDetail, PortalAccountPaginate} from "../interfaces/portal-account.interface";

@Injectable({
  providedIn: 'root'
})
export class PortalAccountService {

  constructor( private http: HttpClient) { }
  private baseUrl: string = environment.baseUrl

  // Get Contact
  getPortalAccountById(id: number) : Observable<PortalAccountDetail> {
    return this.http.get<PortalAccountDetail>(`${this.baseUrl}/customer-portal-accounts/${id}`)
  }

  // Get Contacts
  getPortalAccounts(filter: PortalAccountPaginate, customerId: number): Observable<ModelPortalAccount> {
    let params = new HttpParams();
    filter.page ? params = params.append('page', filter.page) : null;
    filter.page_size ? params = params.append('page_size', filter.page_size) : null;
    customerId ? params = params.append('customer', customerId) : null;
    return this.http.get<ModelPortalAccount>(`${this.baseUrl}/customer-portal-accounts/`, {params})
  }

  // Add Contact
  addPortalAccount(account: PortalAccountDetail): Observable<PortalAccountDetail> {
    return this.http.post<PortalAccountDetail>(`${this.baseUrl}/customer-portal-accounts/`, account)
  }

  // Update Contact
  updatePortalAccount(idAccount: number, account: PortalAccountDetail) : Observable<PortalAccountDetail> {
    return this.http.patch<PortalAccountDetail>(`${this.baseUrl}/customer-portal-accounts/${idAccount}/`, account)
  }

  // Delete Contact
  deleteAccount(id: number) : Observable<number>{
    return this.http.delete<number>(`${this.baseUrl}/customer-portal-accounts/${id}`)
  }

}
