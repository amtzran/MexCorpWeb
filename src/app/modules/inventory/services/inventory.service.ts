import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {
  ConceptDetail,
  ConceptPaginate,
  EntryDetail,
  EntryPaginate, ModelConcept,
  ModelEntry, ModelMovement, ModelWarehouse, ModelWarehouseInventory, StockPaginate
} from "../interfaces/inventory.interface";
import {environment} from "../../../../environments/environment";
import {ModelEmployee, ModelJobCenter} from "../../employee/interfaces/employee.interface";
import {ModelSupplier} from "../../catalog/suppliers/interfaces/suppliers.interface";
import {ModelProduct} from "../../catalog/tools-services/interfaces/product.interface";
import {DateService} from "../../../core/utils/date.service";
import {reportTask} from "../../task/models/task.interface";

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private http: HttpClient,
              private dateService: DateService) { }
  private baseUrl: string = environment.baseUrl

  // Get Entries
  getEntries(filter: EntryPaginate): Observable<ModelEntry> {
    let initial_date = '';
    let final_date = '';
    if (filter.final_date !== '') {
      initial_date = this.dateService.getFormatDataDate(filter.initial_date);
      final_date = this.dateService.getFormatDataDate(filter.final_date);
    }
    let params = new HttpParams();
    filter.page ? params = params.append('page', filter.page) : null;
    filter.page_size ? params = params.append('page_size', filter.page_size) : null;
    filter.employee ? params = params.append('employee', filter.employee) : null;
    filter.group ? params = params.append('group', filter.group) : null;
    filter.supplier ? params = params.append('supplier', filter.supplier) : null;
    initial_date ? params = params.append('initial_date', initial_date) : null;
    final_date ? params = params.append('final_date', final_date) : null;
    return this.http.get<ModelEntry>(`${this.baseUrl}/inventory/entries/`, {params})
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

  // Get Concepts
  getConcepts(filter: ConceptPaginate): Observable<ModelConcept> {
    let params = new HttpParams();
    filter.page ? params = params.append('page', filter.page) : null;
    filter.page_size ? params = params.append('page_size', filter.page_size) : null;
    filter.entrie_id ? params = params.append('entrie_id', filter.entrie_id) : null;
    return this.http.get<ModelConcept>(`${this.baseUrl}/inventory/entrie-concepts/`, {params})
  }

  // Add Concept
  addConcept(concept: ConceptDetail): Observable<ConceptDetail> {
    return this.http.post<ConceptDetail>(`${this.baseUrl}/inventory/entrie-concepts/`, concept);
  }

  // Get Concept
  getConceptById(id: number) : Observable<ConceptDetail> {
    return this.http.get<ConceptDetail>(`${this.baseUrl}/inventory/entrie-concepts/${id}`)
  }

  // Update Concept
  updateConcept(idConcept: number, concept: ConceptDetail) : Observable<ConceptDetail> {
    return this.http.put<ConceptDetail>(`${this.baseUrl}/inventory/entrie-concepts/${idConcept}/`, concept)
  }

  // Delete Concept
  deleteConcept(id: number | undefined) : Observable<ConceptDetail> {
    return this.http.delete<ConceptDetail>(`${this.baseUrl}/inventory/entrie-concepts/${id}`)
  }

  // Get Employees
  getEmployees() : Observable<ModelEmployee> {
    return this.http.get<ModelEmployee>(`${this.baseUrl}/employees/?not_paginate=true`)
  }

  // Get Job Centers
  getJobCenters() : Observable<ModelJobCenter> {
    return this.http.get<ModelJobCenter>(`${this.baseUrl}/groups/`)
  }

  // Get Job Centers
  getSuppliers() : Observable<ModelSupplier> {
    return this.http.get<ModelSupplier>(`${this.baseUrl}/suppliers/`)
  }

  // Get Products
  getProductsAll(id: number): Observable<ModelProduct> {
    let params = new HttpParams();
    params = params.append('not_paginate',true);
    params = params.append('category','repair');
    id ? params = params.append('job_center', id) : null;
    return this.http.get<ModelProduct>(`${this.baseUrl}/products/`, {params})
  }

  // Get Stocks
  getStocks(filter: StockPaginate): Observable<ModelWarehouseInventory> {
    let initial_date = '';
    let final_date = '';
    if (filter.final_date !== '') {
      initial_date = this.dateService.getFormatDataDate(filter.initial_date);
      final_date = this.dateService.getFormatDataDate(filter.final_date);
    }
    let params = new HttpParams();
    filter.page ? params = params.append('page', filter.page) : null;
    filter.page_size ? params = params.append('page_size', filter.page_size) : null;
    filter.warehouse ? params = params.append('warehouse', filter.warehouse) : null;
    filter.product ? params = params.append('product', filter.product) : null;
    initial_date ? params = params.append('initial_date', initial_date) : null;
    final_date ? params = params.append('final_date', final_date) : null;
    return this.http.get<ModelWarehouseInventory>(`${this.baseUrl}/inventory/stock/`, {params})
  }

  getRepairsAll(): Observable<ModelProduct> {
    let params = new HttpParams();
    params = params.append('not_paginate',true);
    params = params.append('category','repair');
    return this.http.get<ModelProduct>(`${this.baseUrl}/products/`, {params})
  }

  getWarehouses() : Observable<ModelWarehouse> {
    return this.http.get<ModelWarehouse>(`${this.baseUrl}/inventory/warehouses/`)
  }

  // Get Stocks
  getMovements(filter: StockPaginate): Observable<ModelMovement> {
    let initial_date = '';
    let final_date = '';
    if (filter.final_date !== '') {
      initial_date = this.dateService.getFormatDataDate(filter.initial_date);
      final_date = this.dateService.getFormatDataDate(filter.final_date);
    }
    let params = new HttpParams();
    filter.page ? params = params.append('page', filter.page) : null;
    filter.page_size ? params = params.append('page_size', filter.page_size) : null;
    filter.product ? params = params.append('product', filter.product) : null;
    filter.employee ? params = params.append('employee', filter.employee) : null;
    filter.movement ? params = params.append('movement', filter.movement) : null;
    filter.origin ? params = params.append('origin', filter.origin) : null;
    filter.destiny ? params = params.append('destiny', filter.destiny) : null;
    initial_date ? params = params.append('initial_date', initial_date) : null;
    final_date ? params = params.append('final_date', final_date) : null;
    return this.http.get<ModelMovement>(`${this.baseUrl}/inventory/movements/`, {params})
  }

  // Report Stocks
  reportStocksAll(filter: StockPaginate) : Observable<any> {
    let initial_date = '', final_date = '';
    if (filter.initial_date !== '' || filter.final_date !== ''){
      initial_date = this.dateService.getFormatDataDate(filter.initial_date)
      final_date = this.dateService.getFormatDataDate(filter.final_date)
    }
    let employee = String(filter.employee);
    let warehouse = String(filter.warehouse);
    let product = String(filter.product);
    let params = new HttpParams();
    params = params.append('warehouse', warehouse);
    params = params.append('employee', employee);
    params = params.append('product', product);
    initial_date ? params = params.append('initial_date', initial_date) : null;
    final_date ? params = params.append('final_date', final_date) : null;
    return this.http.post(`${this.baseUrl}/inventory/stock-export/`, '',{responseType: 'blob', params})
  }

// Report Stocks
  reportMovementsAll(filter: StockPaginate) : Observable<any> {
    let initial_date = '', final_date = '';
    if (filter.initial_date !== '' || filter.final_date !== ''){
      initial_date = this.dateService.getFormatDataDate(filter.initial_date)
      final_date = this.dateService.getFormatDataDate(filter.final_date)
    }
    let employee = String(filter.employee);
    let product = String(filter.product);
    let origin = String(filter.origin);
    let destiny = String(filter.destiny);
    let movement = String(filter.movement);
    let params = new HttpParams();
    params = params.append('employee', employee);
    params = params.append('product', product);
    params = params.append('origin', origin);
    params = params.append('destiny', destiny);
    params = params.append('movement', movement);
    initial_date ? params = params.append('initial_date', initial_date) : null;
    final_date ? params = params.append('final_date', final_date) : null;
    return this.http.post(`${this.baseUrl}/inventory/movements-export/`, '',{responseType: 'blob', params})
  }

}
