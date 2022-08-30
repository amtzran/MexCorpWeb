import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {ModelAttendance} from "../attendance.interface";
import {paginateGeneral} from "../../../shared/interfaces/shared.interface";

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  constructor(private http: HttpClient) {}

  private baseUrl: string = environment.baseUrl

  // Get Attendances
  getAttendances(filter: paginateGeneral): Observable<ModelAttendance> {
    let params = new HttpParams();
    filter.page ? params = params.append('page', filter.page) : null;
    filter.page_size ? params = params.append('page_size', filter.page_size) : null;
    filter.employee ? params = params.append('employee', filter.employee) : null;
    filter.group ? params = params.append('group', filter.group) : null;
    filter.initial_date ? params = params.append('initial_date', filter.initial_date) : null;
    filter.final_date ? params = params.append('final_date', filter.final_date) : null;
    return this.http.get<ModelAttendance>(`${this.baseUrl}/attendances/`, {params})
  }

}
