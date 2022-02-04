import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {reportTask} from "../models/report.interface";
import {DateService} from "../../../core/utils/date.service";

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor( private http: HttpClient,
               private dateService : DateService) { }
  private baseUrl: string = environment.baseUrl

  // Report Tasks
  exportReportTask(filterTask: reportTask, type: string) : Observable<any> {
    let initial_date = this.dateService.getFormatDataDate(filterTask.initial_date)
    let final_date = this.dateService.getFormatDataDate(filterTask.final_date)
    let customer = String(filterTask.customer)
    let employee = String(filterTask.employee)
    let group = String(filterTask.job_center)
    let status = String(filterTask.status)
    let params = new HttpParams();
    params = params.append('initial_date', initial_date);
    params = params.append('final_date', final_date);
    params = params.append('customer', customer);
    params = params.append('employee', employee);
    params = params.append('group', group);
    params = params.append('status', status);
    params = params.append('type', type);
    return this.http.post(`${this.baseUrl}/tasks-export/`, '',{responseType: 'blob', params})
  }

  reportTaskPdf(filterTask: reportTask) : Observable<any> {
    let initial_date = this.dateService.getFormatDataDate(filterTask.initial_date)
    let final_date = this.dateService.getFormatDataDate(filterTask.final_date)
    let customer = String(filterTask.customer)
    let employee = String(filterTask.employee)
    let group = String(filterTask.job_center)
    let params = new HttpParams();
    params = params.append('initial_date', initial_date);
    params = params.append('final_date', final_date);
    params = params.append('customer', customer);
    params = params.append('employee', employee);
    params = params.append('group', group);
    return this.http.post(`${this.baseUrl}/task-summary-report/`, '',{responseType: 'blob', params})
  }

}
