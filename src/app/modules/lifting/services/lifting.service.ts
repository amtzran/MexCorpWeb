import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {Lifting, liftingDetail, LiftingPaginate, ModelLifting, ModelQuotation} from "../interfaces/lifting.interface";
import {DoorDetail} from "../../customer/doors/interfaces/door.interface";

@Injectable({
  providedIn: 'root'
})
export class LiftingService {

  constructor( private http: HttpClient) { }
  private baseUrl: string = environment.baseUrl

  // Get Door
  getLiftingById(id: number | null) : Observable<liftingDetail> {
    return this.http.get<liftingDetail>(`${this.baseUrl}/liftings/${id}/`)
  }

  // Get Liftings
  getLiftings(filter: LiftingPaginate): Observable<ModelLifting> {
    let params = new HttpParams();
    filter.page ? params = params.append('page', filter.page) : null;
    filter.page_size ? params = params.append('page_size', filter.page_size) : null;
    return this.http.get<ModelLifting>(`${this.baseUrl}/liftings/`, {params})
  }

  // Add Lifting
  addLifting(lifting: FormData): Observable<liftingDetail> {
    return this.http.post<liftingDetail>(`${this.baseUrl}/liftings/`, lifting)
  }

  // Update Lifting
  updateLifting(idLifting : number, lifting: FormData) : Observable<liftingDetail> {
    return this.http.post<liftingDetail>(`${this.baseUrl}/liftings/${idLifting}/`, lifting)
  }

  addQuotation(quotation: Lifting) : Observable<any> {
    let quote = {
      lifting_id : quotation.id,
      seller_id: quotation.employee_id
    };
    return this.http.post<any>(`${this.baseUrl}/quotes/`, quote)
  }

  // Get Liftings
  getQuotations(filter: LiftingPaginate): Observable<ModelQuotation> {
    let params = new HttpParams();
    filter.page ? params = params.append('page', filter.page) : null;
    filter.page_size ? params = params.append('page_size', filter.page_size) : null;
    return this.http.get<ModelQuotation>(`${this.baseUrl}/quotes/`, {params})
  }
}
