import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {
  Employee, EmployeeDetail,
  EmployeePaginate,
  ModelEmployee,
  ModelJob,
  ModelJobCenter, ToolsEmployee,
} from "../interfaces/employee.interface";
import {ModelProduct, Product} from "../../catalog/products/interfaces/product.interface";
import {ModelTurn} from "../../catalog/turns/interfaces/turn.interface";
import {DateService} from "../../../core/utils/date.service";
import {reportTask} from "../../task/models/task.interface";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient,
              private dateService: DateService) { }
  private baseUrl: string = environment.baseUrl

  // Get Employee
  getEmployeeById(id: number) : Observable<EmployeeDetail> {
    return this.http.get<EmployeeDetail>(`${this.baseUrl}/employees/${id}`)
  }

  // Get Employees
  getEmployees(filter: EmployeePaginate): Observable<ModelEmployee> {
    let initial_date = '';
    let final_date = '';
    if (filter.initial_date !== '') {
      initial_date = this.dateService.getFormatDataDate(filter.initial_date);
      final_date = this.dateService.getFormatDataDate(filter.final_date);
    }
    let params = new HttpParams();
    filter.page ? params = params.append('page', filter.page) : null;
    filter.page_size ? params = params.append('page_size', filter.page_size) : null;
    filter.employee ? params = params.append('employee', filter.employee) : null;
    filter.job_center ? params = params.append('job_center', filter.job_center) : null;
    filter.job_title ? params = params.append('job_title', filter.job_title) : null;
    filter.turn ? params = params.append('turn', filter.turn) : null;
    initial_date ? params = params.append('initial_date', initial_date) : null;
    final_date ? params = params.append('final_date', final_date) : null;
    return this.http.get<ModelEmployee>(`${this.baseUrl}/employees/`, {params})
  }

  // Report Attendances
  reportEmployeesExcel(filter: EmployeePaginate) : Observable<any> {
    let params = new HttpParams();
    let employee = String(filter.employee);
    let job_center = String(filter.job_center);
    let job_title = String(filter.job_title);
    let turn = String(filter.turn);
    let initial_date = '';
    let final_date = '';
    if (filter.initial_date !== '' || filter.final_date !== ''){
      initial_date = this.dateService.getFormatDataDate(filter.initial_date)
      final_date = this.dateService.getFormatDataDate(filter.final_date)
    }
    employee ? params = params.append('employee', employee) : null;
    job_center ? params = params.append('job_center', job_center) : null;
    job_title ? params = params.append('job_title', job_title) : null;
    turn ? params = params.append('turn', turn) : null;
    initial_date ? params = params.append('initial_date', initial_date) : null;
    final_date ? params = params.append('final_date', final_date) : null;
    return this.http.post(`${this.baseUrl}/employees-export/`, '',{responseType: 'blob', params})
  }

  // Add Employee
  addEmployee(employee: EmployeeDetail): Observable<EmployeeDetail> {
    return this.http.post<EmployeeDetail>(`${this.baseUrl}/employees/`, employee)
  }

  // Update Employee
  updateEmployee(idEmployee: number,employee: EmployeeDetail) : Observable<EmployeeDetail> {
    return this.http.put<EmployeeDetail>(`${this.baseUrl}/employees/${idEmployee}/`,employee)
  }

  // Patch Employee
  patchEmployeeStatus(idEmployee: number, status: boolean) : Observable<Employee> {
    let updateFields = {is_active: status}
    return this.http.patch<Employee>(`${this.baseUrl}/employees/${idEmployee}/active`, updateFields)
  }

  // Delete Employee
  deleteEmployee(id: number) : Observable<number>{
    return this.http.delete<number>(`${this.baseUrl}/employees/${id}`)
  }

  // reset Password Employee
  resetPassword(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(`${this.baseUrl}/employees-reset-password/`, employee)
  }

  // Get Job Centers
  getJobCenters() : Observable<ModelJobCenter> {
    return this.http.get<ModelJobCenter>(`${this.baseUrl}/groups/`)
  }

  // Get Jobs
  getJobs() : Observable<ModelJob> {
    return this.http.get<ModelJob>(`${this.baseUrl}/jobs/`)
  }

  getTurns() : Observable<ModelTurn> {
    return this.http.get<ModelTurn>(`${this.baseUrl}/turns/`)
  }

  // Get Jobs
  getProducts() : Observable<ModelProduct> {
    let params = new HttpParams();
    params = params.append('not_paginate', 'true')
    return this.http.get<ModelProduct>(`${this.baseUrl}/products/`, {params})
  }

  // Report Tools Employee
  exportReportTools(id: number) : Observable<any> {
    return this.http.post(`${this.baseUrl}/employees-receipt-tools/${id}`, '',{responseType: 'blob'})
  }

  // Report Gafete Employee
  exportReportGafete(id: number) : Observable<any> {
    return this.http.post(`${this.baseUrl}/employees-card/${id}`, '',{responseType: 'blob'})
  }

  // Add Tools By Employee
  addTool(id: number, tools: ToolsEmployee): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/employees/${id}/product/`, tools)
  }

  // Update Tools By Employee
  updateTool(idEmployee: number, tools: ToolsEmployee): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/employees/${idEmployee}/product/`, tools)
  }

  // Update Tools By Employee
  deleteTool(idEmployee: number, idTool: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/employees/${idEmployee}/product/${idTool}`)
  }

}
