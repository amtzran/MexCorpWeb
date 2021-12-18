import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {DoorType, DoorTypePaginate, ModelDoorType} from "../models/door-type.interface";

@Injectable({
  providedIn: 'root'
})
export class DoorTypeService {

  constructor( private http: HttpClient) { }
  private baseUrl: string = environment.baseUrl

  // Get Door Type
  getDoorTypeById(id: number) : Observable<DoorType> {
    return this.http.get<DoorType>(`${this.baseUrl}/door-types/${id}`)
  }

  // Get Door Types
  getDoorTypes(filter: DoorTypePaginate): Observable<ModelDoorType> {
    let params = new HttpParams();
    filter.page ? params = params.append('page', filter.page) : null;
    filter.page_size ? params = params.append('page_size', filter.page_size) : null;
    return this.http.get<ModelDoorType>(`${this.baseUrl}/door-types/`, {params})
  }

  // Add Door Type
  addDoorType(doorType: DoorType): Observable<DoorType> {
    return this.http.post<DoorType>(`${this.baseUrl}/door-types/`, doorType)
  }

  // Update Door Type
  updateDoorType(idDoorType: number, doorType: DoorType) : Observable<DoorType> {
    return this.http.put<DoorType>(`${this.baseUrl}/door-types/${idDoorType}/`,doorType)
  }

  // Delete Door Type
  deleteDoorType(id: number) : Observable<number>{
    return this.http.delete<number>(`${this.baseUrl}/door-types/${id}`)
  }

}
