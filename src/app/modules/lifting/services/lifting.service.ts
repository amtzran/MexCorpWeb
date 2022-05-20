import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {liftingDetail, LiftingPaginate, ModelLifting} from "../interfaces/lifting.interface";

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

  // Update Door
  updateLifting(idLifting : number, lifting: FormData) : Observable<liftingDetail> {
    return this.http.post<liftingDetail>(`${this.baseUrl}/liftings/${idLifting}/`, lifting)
  }

}
