import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {
  CalendarForm,
  EmailSend,
  ModelTask,
  ModelWorkType,
  reportTask,
  Task,
  TaskDetail
} from "../models/task.interface";
import {ModelCustomer} from "../../customer/customers/interfaces/customer.interface";
import {ModelEmployee, ModelJobCenter} from "../../employee/interfaces/employee.interface";
import {DoorDetailTask, ModelDoorType} from "../../customer/doors/interfaces/door.interface";
import {DateService} from "../../../core/utils/date.service";
import {paginateGeneral} from "../../../shared/interfaces/shared.interface";

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient,
              private dateService : DateService) { }
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
    status: string | number
    ): Observable<ModelTask> {
    let params = new HttpParams();
    params = params.append('customer', idCustomer)
    params = params.append('employee', idEmployee)
    params = params.append('group', idJobCenter)
    params = params.append('status', status)
    return this.http.get<ModelTask>(`${this.baseUrl}/tasks/`,{params})
  }

  // get Tasks Table
  getTasksPaginate(filter : paginateGeneral, calendar: CalendarForm){
    let params = new HttpParams();
    filter.page ? params = params.append('page', filter.page) : null;
    filter.page_size ? params = params.append('page_size', filter.page_size) : null;
    calendar.customer ? params = params.append('customer', calendar.customer) : null;
    calendar.employee ? params = params.append('employee', calendar.employee) : null;
    calendar.job_center ? params = params.append('group', calendar.job_center) : null;
    calendar.status ? params = params.append('status', calendar.status) : null;
    params = params.append('with_paginate', 'true');
    return this.http.get<ModelTask>(`${this.baseUrl}/tasks/`,{params})
  }

  // Add Task
  addTask(task: Task): Observable<TaskDetail> {
    return this.http.post<TaskDetail>(`${this.baseUrl}/tasks/`, task)
  }

  // multiple Task
  multipleTask(task: Task): Observable<TaskDetail> {
    return this.http.post<TaskDetail>(`${this.baseUrl}/tasks-multiple/`, task)
  }

  // Update Task
  updateTask(idTask: number, task: Task) : Observable<TaskDetail> {
    return this.http.put<TaskDetail>(`${this.baseUrl}/tasks/${idTask}/`, task)
  }

  /*// Patch Date And Hour
  patchTaskDateAndHour(idTask: number, date: CalendarDate) : Observable<Task> {
    let updateFields = {
      initial_date: date.initial_date,
      final_date: date.final_date,
      initial_hour: date.initial_hour,
      final_hour: date.final_hour
    }
    return this.http.patch<Task>(`${this.baseUrl}/employees/update/${idTask}/`, updateFields)
  }*/

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

  // Report Summary
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

  reportCalendarPdf(filterTask: reportTask) : Observable<any> {
    let initial_date = this.dateService.getFormatDataDate(filterTask.initial_date)
    let final_date = this.dateService.getFormatDataDate(filterTask.final_date)
    let customer = String(filterTask.customer)
    let employee = String(filterTask.employee)
    let group = String(filterTask.job_center)
    let work_type = String(filterTask.work_type)
    let params = new HttpParams();
    params = params.append('initial_date', initial_date);
    params = params.append('final_date', final_date);
    params = params.append('customer', customer);
    params = params.append('employee', employee);
    params = params.append('group', group);
    params = params.append('work_type', work_type)
    return this.http.post(`${this.baseUrl}/task-calendar-report/`, '',{responseType: 'blob', params})
  }

  // Report Services Finalized
  reportServiceFinalizedPdf(filterTask: reportTask) : Observable<any> {
    let initial_date = this.dateService.getFormatDataDate(filterTask.initial_date)
    let final_date = this.dateService.getFormatDataDate(filterTask.final_date)
    let customer = String(filterTask.customer)
    let employee = String(filterTask.employee)
    let group = String(filterTask.job_center)
    let work_type = String(filterTask.work_type)
    let params = new HttpParams();
    params = params.append('initial_date', initial_date);
    params = params.append('final_date', final_date);
    params = params.append('customer', customer);
    params = params.append('employee', employee);
    params = params.append('group', group);
    params = params.append('work_type', work_type)
    return this.http.post(`${this.baseUrl}/task-finished-report/`, '',{responseType: 'blob', params})
  }

  // Report Services Finalized
  reportServiceFinalizedExcel(filterTask: reportTask) : Observable<any> {
    let initial_date = this.dateService.getFormatDataDate(filterTask.initial_date)
    let final_date = this.dateService.getFormatDataDate(filterTask.final_date)
    let customer = String(filterTask.customer)
    let employee = String(filterTask.employee)
    let group = String(filterTask.job_center)
    let work_type = String(filterTask.work_type)
    let params = new HttpParams();
    params = params.append('initial_date', initial_date);
    params = params.append('final_date', final_date);
    params = params.append('customer', customer);
    params = params.append('employee', employee);
    params = params.append('group', group);
    params = params.append('work_type', work_type)
    return this.http.post(`${this.baseUrl}/task-finished-report-excel/`, '',{responseType: 'blob', params})
  }

  // send email door By Task
  sendEmail(email: EmailSend) : Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/tasks-form-report-send-email/`, email)
  }

  // Update Invoice
  updateInvoice(event: any, id: number) : Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/tasks/${id}/invoiced/`,  {'invoiced': event.checked} )
  }

}
