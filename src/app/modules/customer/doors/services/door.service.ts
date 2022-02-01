import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {Observable} from "rxjs";
import {Door, DoorDetail, DoorPaginate, ModelDoor, ModelDoorType, reportDoor} from "../interfaces/door.interface";
import {reportCustomer} from "../../customers/interfaces/customer.interface";
import {DateService} from "../../../../core/utils/date.service";

@Injectable({
  providedIn: 'root'
})
export class DoorService {

  constructor(private http: HttpClient,
              private dateService: DateService) { }
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
  addDoor(door: FormData): Observable<DoorDetail> {
    return this.http.post<DoorDetail>(`${this.baseUrl}/doors/`, door)
  }

  // Update Door
  updateDoor(idDoor : number, door: FormData) : Observable<DoorDetail> {
    return this.http.post<DoorDetail>(`${this.baseUrl}/doors/${idDoor}/`, door)
  }

  // Delete Door
  deleteDoor(id: number) : Observable<number>{
    return this.http.delete<number>(`${this.baseUrl}/doors/${id}`)
  }

  // Get Door Types
  getDoorTypes() : Observable<ModelDoorType> {
    return this.http.get<ModelDoorType>(`${this.baseUrl}/door-types/`)
  }

  // Report Doors By Customer
  exportReportDoorsBYCustomer(filterDoor: reportDoor, type: string) : Observable<any> {
    let initial_date, final_date;
    if (filterDoor.initial_date === '')  {
      initial_date = '';
      final_date = '';
    }
    else {
      initial_date = this.dateService.getFormatDataDate(filterDoor.initial_date)
      final_date = this.dateService.getFormatDataDate(filterDoor.final_date)
    }

    let customer = String(filterDoor.customer)
    let door_type = String(filterDoor.door_type)
    let params = new HttpParams();
    params = params.append('initial_date', initial_date);
    params = params.append('final_date', final_date);
    params = params.append('customer', customer);
    params = params.append('door_type', door_type);
    params = params.append('type', type);
    return this.http.post(`${this.baseUrl}/doors-export/`, '',{responseType: 'blob', params})
  }

}
