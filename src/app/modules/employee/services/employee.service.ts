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
import {ModelProduct, Product} from "../../catalog/product/interfaces/product.interface";
import {reportTask} from "../../task/models/task.interface";
import {ContractDetail} from "../../catalog/contracts/models/contract.interface";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor( private http: HttpClient) { }
  private baseUrl: string = environment.baseUrl

  // Get Employee
  getEmployeeById(id: number) : Observable<EmployeeDetail> {
    return this.http.get<EmployeeDetail>(`${this.baseUrl}/employees/${id}`)
  }

  // Get Employees
  getEmployees(filter: EmployeePaginate): Observable<ModelEmployee> {
    let params = new HttpParams();
    filter.page ? params = params.append('page', filter.page) : null;
    filter.page_size ? params = params.append('page_size', filter.page_size) : null;
    return this.http.get<ModelEmployee>(`${this.baseUrl}/employees/`, {params})
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
    return this.http.patch<Employee>(`${this.baseUrl}/employees/${idEmployee}/`, updateFields)
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

  // Add Tools By Employee
  addTool(id: number, tools: ToolsEmployee): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/employees/${id}/product/`, tools)
  }

  // Update Tools By Employee
  updateTool(tool: Product, tools: ToolsEmployee): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/employees/${tool.id}/product/`, tools)
  }

  // Update Tools By Employee
  deleteTool(idEmployee: number, idTool: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/employees/${idEmployee}/product/${idTool}`)
  }

}
