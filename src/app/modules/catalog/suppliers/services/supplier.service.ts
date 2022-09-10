import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {Observable} from "rxjs";
import {ModelSupplier, SupplierDetail, SupplierPaginate} from "../interfaces/suppliers.interface";

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  constructor( private http: HttpClient) { }
  private baseUrl: string = environment.baseUrl

  // Get Supplier
  getSupplierById(id: number) : Observable<SupplierDetail> {
    return this.http.get<SupplierDetail>(`${this.baseUrl}/suppliers/${id}`)
  }

  // Get Suppliers
  getSuppliers(filter: SupplierPaginate): Observable<ModelSupplier> {
    let params = new HttpParams();
    filter.page ? params = params.append('page', filter.page) : null;
    filter.page_size ? params = params.append('page_size', filter.page_size) : null;
    return this.http.get<ModelSupplier>(`${this.baseUrl}/suppliers/`, {params})
  }

  // Add Supplier
  addSupplier(contract: SupplierDetail): Observable<SupplierDetail> {
    return this.http.post<SupplierDetail>(`${this.baseUrl}/suppliers/`, contract)
  }

  // Update Supplier
  updateSupplier(idContract: number, contract: SupplierDetail) : Observable<SupplierDetail> {
    return this.http.put<SupplierDetail>(`${this.baseUrl}/suppliers/${idContract}/`,contract)
  }

  // Delete Supplier
  deleteSupplier(id: number) : Observable<number>{
    return this.http.delete<number>(`${this.baseUrl}/suppliers/${id}`)
  }

}
