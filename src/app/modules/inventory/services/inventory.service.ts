import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {
  ConceptPaginate,
  EntryDetail,
  EntryPaginate, ModelConcept,
  ModelEntry
} from "../interfaces/inventory.interface";
import {environment} from "../../../../environments/environment";
import {ModelJobCenter} from "../../employee/interfaces/employee.interface";
import {ModelSupplier} from "../../catalog/suppliers/interfaces/suppliers.interface";

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor( private http: HttpClient) { }
  private baseUrl: string = environment.baseUrl

  // Get Entries
  getEntries(filter: EntryPaginate): Observable<ModelEntry> {
    let params = new HttpParams();
    filter.page ? params = params.append('page', filter.page) : null;
    filter.page_size ? params = params.append('page_size', filter.page_size) : null;
    filter.employee ? params = params.append('employee', filter.employee) : null;
    filter.group ? params = params.append('group', filter.group) : null;
    filter.initial_date ? params = params.append('initial_date', filter.initial_date) : null;
    filter.final_date ? params = params.append('final_date', filter.final_date) : null;
    return this.http.get<ModelEntry>(`${this.baseUrl}/inventory/entries/`, {params})
  }

  // Get Entries
  getConcepts(filter: ConceptPaginate): Observable<ModelConcept> {
    console.log(filter)
    let params = new HttpParams();
    filter.page ? params = params.append('page', filter.page) : null;
    filter.page_size ? params = params.append('page_size', filter.page_size) : null;
    filter.entrie_id ? params = params.append('entrie_id', filter.entrie_id) : null;
    return this.http.get<ModelConcept>(`${this.baseUrl}/inventory/entrie-concepts/`, {params})
  }

  // Get Entry
  getEntryById(id: number) : Observable<EntryDetail> {
    return this.http.get<EntryDetail>(`${this.baseUrl}/inventory/entries/${id}`)
  }

  // Add Entry
  addEntry(entry: EntryDetail): Observable<EntryDetail> {
    return this.http.post<EntryDetail>(`${this.baseUrl}/inventory/entries/`, entry)
  }

  // Update Entry
  updateEntry(idEntry: number, entry: EntryDetail) : Observable<EntryDetail> {
    return this.http.put<EntryDetail>(`${this.baseUrl}/inventory/entries/${idEntry}/`,entry)
  }

  // Delete Entry
  deleteEntry(id: number) : Observable<EntryDetail>{
    return this.http.delete<EntryDetail>(`${this.baseUrl}/inventory/entries/${id}`)
  }

  // Get Job Centers
  getJobCenters() : Observable<ModelJobCenter> {
    return this.http.get<ModelJobCenter>(`${this.baseUrl}/groups/`)
  }

  // Get Job Centers
  getSuppliers() : Observable<ModelSupplier> {
    return this.http.get<ModelSupplier>(`${this.baseUrl}/suppliers/`)
  }

}
