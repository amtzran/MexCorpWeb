import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {Observable} from "rxjs";
import {Door, DoorDetail, DoorPaginate, ModelDoor, ModelDoorType} from "../interfaces/door.interface";

@Injectable({
  providedIn: 'root'
})
export class DoorService {

  constructor( private http: HttpClient) { }
  private baseUrl: string = environment.baseUrl

  // Get Doors
  getDoors(filter: DoorPaginate, customerId: any): Observable<ModelDoor> {
    let params = new HttpParams();
    filter.page ? params = params.append('page', filter.page) : null;
    filter.page_size ? params = params.append('page_size', filter.page_size) : null;
    customerId ? params = params.append('customer', customerId) : null;
    return this.http.get<ModelDoor>(`${this.baseUrl}/doors/`, {params})
  }

  // Get Door
  getDoorById(id: number | null) : Observable<DoorDetail> {
    return this.http.get<DoorDetail>(`${this.baseUrl}/doors/${id}/`)
  }

  // Add Door
  addDoor(door: DoorDetail): Observable<DoorDetail> {
    return this.http.post<DoorDetail>(`${this.baseUrl}/doors/`, door)
  }

  // Update Door
  updateDoor(idDoor : number, door: DoorDetail) : Observable<DoorDetail> {
    return this.http.put<DoorDetail>(`${this.baseUrl}/doors/${idDoor}/`, door)
  }

  // Delete Door
  deleteDoor(id: number) : Observable<number>{
    return this.http.delete<number>(`${this.baseUrl}/doors/${id}`)
  }

  // Get Door Types
  getDoorTypes() : Observable<ModelDoorType> {
    return this.http.get<ModelDoorType>(`${this.baseUrl}/door-types/`)
  }

}
