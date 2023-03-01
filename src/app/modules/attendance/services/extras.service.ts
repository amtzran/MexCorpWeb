import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {paginateGeneral} from "../../../shared/interfaces/shared.interface";
import {reportTask} from "../../task/models/task.interface";
import {DateService} from "../../../core/utils/date.service";
import {ModelExtras} from "../interfaces/extras.interface";

@Injectable({
  providedIn: 'root'
})
export class ExtrasService {

  constructor(private http: HttpClient,
              private dateService: DateService) {}

  private baseUrl: string = environment.baseUrl

  // Get Extras
  getExtras(filter: paginateGeneral): Observable<ModelExtras> {
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
    initial_date ? params = params.append('initial_date', initial_date) : null;
    final_date ? params = params.append('final_date', final_date) : null;
    return this.http.get<ModelExtras>(`${this.baseUrl}/attendances-extras/`, {params})
  }

  // Report Attendances
  reportAttendanceExcel(filter: reportTask) : Observable<any> {
    let params = new HttpParams();
    let employee = String(filter.employee)
    let group = String(filter.group)
    let initial_date = '';
    let final_date = '';
    if (filter.initial_date !== '' || filter.final_date !== ''){
      initial_date = this.dateService.getFormatDataDate(filter.initial_date)
      final_date = this.dateService.getFormatDataDate(filter.final_date)
    }
    params = params.append('employee', employee);
    params = params.append('group', group);
    initial_date ? params = params.append('initial_date', initial_date) : null;
    final_date ? params = params.append('final_date', final_date) : null;
    return this.http.post(`${this.baseUrl}/attendances-export/`, '',{responseType: 'blob', params})
  }

  // Report Attendance by Employee
  exportReportByEmployee(filter: reportTask, type: string) : Observable<any> {
    let initial_date = '';
    let final_date = '';
    if (filter.final_date !== '') {
      initial_date = this.dateService.getFormatDataDate(filter.initial_date);
      final_date = this.dateService.getFormatDataDate(filter.final_date);
    }
    let employee = String(filter.employee)
    let group = String(filter.job_center)
    let params = new HttpParams();
    params = params.append('initial_date', initial_date);
    params = params.append('final_date', final_date);
    params = params.append('employee', employee);
    params = params.append('group', group);
    params = params.append('type_export', type);
    return this.http.post(`${this.baseUrl}/attendances-report-employee/`, '',{responseType: 'blob', params})
  }

}
