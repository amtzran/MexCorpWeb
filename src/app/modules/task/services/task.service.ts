import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {ModelWorkType, Task} from "../models/task.interface";
import {ModelCustomer, ModelTypeCustomer} from "../../customer/interfaces/customer.interface";
import {ModelEmployee, ModelJobCenter} from "../../employee/interfaces/employee.interface";

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor( private http: HttpClient) { }
  private baseUrl: string = environment.baseUrl

  // Get Task
  getTaskById(id: number) : Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/contracts/${id}`)
  }

  // Get Tasks
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/tasks/`,)
  }

  // Add Task
  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.baseUrl}/tasks/`, task)
  }

  // Update Contract
  updateTask(idTask: number, task: Task) : Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/contracts/${idTask}/`, task)
  }
  /*
    // Delete Contract
    deleteContract(id: number) : Observable<number>{
      return this.http.delete<number>(`${this.baseUrl}/contracts/${id}`)
    }*/

  // Get Customer
  getCustomers() : Observable<ModelCustomer> {
    return this.http.get<ModelCustomer>(`${this.baseUrl}/customers/`)
  }

  // Get Customer
  getJobCenters() : Observable<ModelJobCenter> {
    return this.http.get<ModelJobCenter>(`${this.baseUrl}/job-centers/`)
  }

  // Get Employees
  getEmployees() : Observable<ModelEmployee> {
    return this.http.get<ModelEmployee>(`${this.baseUrl}/employees/`)
  }

  // Get Work Types
  getWorkTypes() : Observable<ModelWorkType> {
    return this.http.get<ModelWorkType>(`${this.baseUrl}/work-types/`)
  }

}
