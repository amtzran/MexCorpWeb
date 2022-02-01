import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {CalendarDate, ModelTask, ModelWorkType, Task, TaskDetail} from "../models/task.interface";
import {ModelCustomer} from "../../customer/customers/interfaces/customer.interface";
import {Employee, ModelEmployee, ModelJobCenter} from "../../employee/interfaces/employee.interface";
import {Door, DoorDetailTask, ModelDoorType} from "../../customer/doors/interfaces/door.interface";

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

  // Get Task By Doors
  getTaskByIdDoors(id: number) : Observable<DoorDetailTask> {
    return this.http.get<DoorDetailTask>(`${this.baseUrl}/tasks-doors-finished/${id}`)
  }

  // Get Tasks
  getTasks(
    idCustomer: string | number,
    idEmployee: string | number,
    idJobCenter: string | number,
    status: string | number): Observable<ModelTask> {
    let params = new HttpParams();
    params = params.append('customer', idCustomer)
    params = params.append('employee', idEmployee)
    params = params.append('group', idJobCenter)
    params = params.append('status', status)
    return this.http.get<ModelTask>(`${this.baseUrl}/tasks/`,{params})
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

  // Delete Task
  deleteTask(id: number) : Observable<Task>{
    return this.http.delete<Task>(`${this.baseUrl}/tasks/${id}`)
  }

  // Get Customer
  getCustomers() : Observable<ModelCustomer> {
    return this.http.get<ModelCustomer>(`${this.baseUrl}/customers/?not_paginate=true`)
  }

  // Get Job Centers
  getJobCenters() : Observable<ModelJobCenter> {
    return this.http.get<ModelJobCenter>(`${this.baseUrl}/groups/`)
  }

  // Get Employees
  getEmployees() : Observable<ModelEmployee> {
    return this.http.get<ModelEmployee>(`${this.baseUrl}/employees/?not_paginate=true`)
  }

  // Get Work Types
  getWorkTypes() : Observable<ModelWorkType> {
    return this.http.get<ModelWorkType>(`${this.baseUrl}/work-types/?not_paginate=true`)
  }

  // Get Door Types By Customer
  getDoorTypes(idCustomer: number) : Observable<ModelDoorType> {
    let params = new HttpParams();
    idCustomer ? params = params.append('customer', idCustomer) : null;
    params = params.append('not_paginate', 'true');
    return this.http.get<ModelDoorType>(`${this.baseUrl}/doors/`,{params})
  }

}
