import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {ContractDetail, ContractPaginate, ModelContract} from "../models/contract.interface";

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  constructor( private http: HttpClient) { }
  private baseUrl: string = environment.baseUrl

  // Get Contract
  getContractById(id: number) : Observable<ContractDetail> {
    return this.http.get<ContractDetail>(`${this.baseUrl}/contracts/${id}`)
  }

  // Get Contracts
  getContracts(filter: ContractPaginate): Observable<ModelContract> {
    let params = new HttpParams();
    filter.page ? params = params.append('page', filter.page) : null;
    filter.page_size ? params = params.append('page_size', filter.page_size) : null;
    return this.http.get<ModelContract>(`${this.baseUrl}/contracts/`, {params})
  }

  // Add Contract
  addContract(contract: ContractDetail): Observable<ContractDetail> {
    return this.http.post<ContractDetail>(`${this.baseUrl}/contracts/`, contract)
  }

  // Update Contract
  updateContract(idContract: number, contract: ContractDetail) : Observable<ContractDetail> {
    return this.http.put<ContractDetail>(`${this.baseUrl}/contracts/${idContract}/`,contract)
  }

  // Delete Contract
  deleteContract(id: number) : Observable<number>{
    return this.http.delete<number>(`${this.baseUrl}/contracts/${id}`)
  }

}
