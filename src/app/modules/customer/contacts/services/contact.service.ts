import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {Contact, ContactDetail, ContactPaginate, ModelContact} from "../models/contact.interface";

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor( private http: HttpClient) { }
  private baseUrl: string = environment.baseUrl

  // Get Contact
  getContactById(id: number) : Observable<ContactDetail> {
    return this.http.get<ContactDetail>(`${this.baseUrl}/customer-contacts/${id}`)
  }

  // Get Contacts
  getContacts(filter: ContactPaginate, customerId: number): Observable<ModelContact> {
    let params = new HttpParams();
    filter.page ? params = params.append('page', filter.page) : null;
    filter.page_size ? params = params.append('page_size', filter.page_size) : null;
    customerId ? params = params.append('customer', customerId) : null;
    return this.http.get<ModelContact>(`${this.baseUrl}/customer-contacts/`, {params})
  }

  // Add Contact
  addContact(contact: ContactDetail): Observable<ContactDetail> {
    return this.http.post<ContactDetail>(`${this.baseUrl}/customer-contacts/`, contact)
  }

  // Update Contact
  updateContact(idContract: number, contact: ContactDetail) : Observable<ContactDetail> {
    return this.http.put<ContactDetail>(`${this.baseUrl}/customer-contacts/${idContract}/`,contact)
  }

  // Delete Contact
  deleteContact(id: number) : Observable<number>{
    return this.http.delete<number>(`${this.baseUrl}/customer-contacts/${id}`)
  }

}
