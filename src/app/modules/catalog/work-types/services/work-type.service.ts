import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {ModelWorkType, WorkType, WorkTypePaginate} from "../models/work-type.interface";

@Injectable({
  providedIn: 'root'
})
export class WorkTypeService {

  constructor( private http: HttpClient) { }
  private baseUrl: string = environment.baseUrl

  // Get Work Type
  getWorkTypeById(id: number) : Observable<WorkType> {
    return this.http.get<WorkType>(`${this.baseUrl}/work-types/${id}`)
  }

  // Get Work Type
  getWorkTypes(filter: WorkTypePaginate): Observable<ModelWorkType> {
    let params = new HttpParams();
    filter.page ? params = params.append('page', filter.page) : null;
    filter.page_size ? params = params.append('page_size', filter.page_size) : null;
    return this.http.get<ModelWorkType>(`${this.baseUrl}/work-types/`, {params})
  }

  // Add Work Type
  addWorkType(doorType: WorkType): Observable<WorkType> {
    return this.http.post<WorkType>(`${this.baseUrl}/work-types/`, doorType)
  }

  // Update Work Type
  updateWorkType(idDoorType: number, doorType: WorkType) : Observable<WorkType> {
    return this.http.put<WorkType>(`${this.baseUrl}/work-types/${idDoorType}/`,doorType)
  }

  // Delete Work Type
  deleteWorkType(id: number) : Observable<number>{
    return this.http.delete<number>(`${this.baseUrl}/work-types/${id}`)
  }

}
