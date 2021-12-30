import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {CalendarDate, ModelTask, ModelWorkType, Task, TaskDetail} from "../models/task.interface";
import {ModelCustomer} from "../../customer/customers/interfaces/customer.interface";
import {Employee, ModelEmployee, ModelJobCenter} from "../../employee/interfaces/employee.interface";
import {ModelDoorType} from "../../customer/doors/interfaces/door.interface";

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor( private http: HttpClient) { }
  private baseUrl: string = environment.baseUrl

  // Get Task
  getTaskById(id: number) : Observable<TaskDetail> {
    return this.http.get<TaskDetail>(`${this.baseUrl}/tasks/${id}`)
  }

  // Get Tasks
  getTasks(): Observable<ModelTask> {
    return this.http.get<ModelTask>(`${this.baseUrl}/tasks/`,)
  }

  // Add Task
  addTask(task: Task): Observable<TaskDetail> {
    return this.http.post<TaskDetail>(`${this.baseUrl}/tasks/`, task)
  }

  // Update Contract
  updateTask(idTask: number, task: TaskDetail) : Observable<TaskDetail> {
    return this.http.put<TaskDetail>(`${this.baseUrl}/tasks/${idTask}/`, task)
  }

  // Patch Date And Hour
  patchTaskDateAndHour(idTask: number, date: CalendarDate) : Observable<Task> {
    let updateFields = {
      initial_date: date.initial_date,
      final_date: date.final_date,
      initial_hour: date.initial_hour,
      final_hour: date.final_hour
    }
    return this.http.patch<Task>(`${this.baseUrl}/employees/update/${idTask}/`, updateFields)
  }
 /* // Delete Task
  deleteTask(id: number) : Observable<number>{
    return this.http.delete<number>(`${this.baseUrl}/tasks/${id}`)
  }*/

  // Get Customer
  getCustomers() : Observable<ModelCustomer> {
    return this.http.get<ModelCustomer>(`${this.baseUrl}/customers/`)
  }

  // Get Customer
  getJobCenters() : Observable<ModelJobCenter> {
    return this.http.get<ModelJobCenter>(`${this.baseUrl}/groups/`)
  }

  // Get Employees
  getEmployees() : Observable<ModelEmployee> {
    return this.http.get<ModelEmployee>(`${this.baseUrl}/employees/`)
  }

  // Get Work Types
  getWorkTypes() : Observable<ModelWorkType> {
    return this.http.get<ModelWorkType>(`${this.baseUrl}/work-types/`)
  }

  // Get Door Types By Customer
  getDoorTypes(idCustomer: number) : Observable<ModelDoorType> {
    let params = new HttpParams();
    idCustomer ? params = params.append('customer', idCustomer) : null;
    return this.http.get<ModelDoorType>(`${this.baseUrl}/doors/`,{params})
  }

}
