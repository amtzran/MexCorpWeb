import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Employee, EmployeePaginate, ModelEmployee, ModelJob, ModelJobCenter} from "../interfaces/employee.interface";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor( private http: HttpClient) { }
  private baseUrl: string = environment.baseUrl

  // Get Employee
  getEmployeeById(id: number) : Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/employees/${id}`)
  }

  // Get Employees
  getEmployees(filter: EmployeePaginate): Observable<ModelEmployee> {
    let params = new HttpParams();
    filter.page ? params = params.append('page', filter.page) : null;
    filter.page_size ? params = params.append('page_size', filter.page_size) : null;
    return this.http.get<ModelEmployee>(`${this.baseUrl}/employees/`, {params})
  }

  // Add Employee
  addEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(`${this.baseUrl}/employees/`, employee)
  }

  // Update Employee
  updateEmployee(idEmployee: number,employee: Employee) : Observable<Employee> {
    return this.http.put<Employee>(`${this.baseUrl}/employees/${idEmployee}/`,employee)
  }

  // Delete Employee
  deleteEmployee(id: number) : Observable<number>{
    return this.http.delete<number>(`${this.baseUrl}/employees/${id}`)
  }

  // Get Job Centers
  getJobCenters() : Observable<ModelJobCenter> {
    return this.http.get<ModelJobCenter>(`${this.baseUrl}/job-centers/`)
  }

  // Get Jobs
  getJobs() : Observable<ModelJob> {
    return this.http.get<ModelJob>(`${this.baseUrl}/jobs/`)
  }

}
