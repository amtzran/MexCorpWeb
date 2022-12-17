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
import {
  DoorDetailTask,
  ModelDoorType,
  ProductByTask,
  ProductByTaskDetail
} from "../../customer/doors/interfaces/door.interface";
import {DateService} from "../../../core/utils/date.service";
import {paginateGeneral} from "../../../shared/interfaces/shared.interface";
import {ModelProduct, Product, ProductDetail} from "../../catalog/tools-services/interfaces/product.interface";

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

  // Get Task By Doors
  getProductsByTask(id: number) : Observable<ProductByTaskDetail> {
    return this.http.get<ProductByTaskDetail>(`${this.baseUrl}/tasks/${id}/product`)
  }

  // Get Tasks
  getTasks(
    idTask: string | number,
    idCustomer: string | number,
    idEmployee: string | number,
    idJobCenter: string | number,
    status: string | number,
    idWorkType: string | number,
    idDoor: string | number,
    ): Observable<ModelTask> {
    let params = new HttpParams();
    params = params.append('id', idTask)
    params = params.append('customer', idCustomer)
    params = params.append('employee', idEmployee)
    params = params.append('group', idJobCenter)
    params = params.append('status', status)
    params = params.append('work_type', idWorkType)
    params = params.append('door_id', idDoor)
    return this.http.get<ModelTask>(`${this.baseUrl}/tasks/`,{params})
  }

  // get Tasks Table
  getTasksPaginate(filter : paginateGeneral, calendar: CalendarForm){
    let params = new HttpParams();
    let initial_date = this.dateService.getFormatDataDate(calendar.initial_date)
    let final_date = this.dateService.getFormatDataDate(calendar.final_date)
    filter.page ? params = params.append('page', filter.page) : null;
    filter.page_size ? params = params.append('page_size', filter.page_size) : null;
    filter.id ? params = params.append('id', filter.id) : null;
    calendar.customer ? params = params.append('customer', calendar.customer) : null;
    calendar.door_id ? params = params.append('door_id', calendar.door_id) : null;
    calendar.employee ? params = params.append('employee', calendar.employee) : null;
    calendar.job_center ? params = params.append('group', calendar.job_center) : null;
    calendar.status ? params = params.append('status', calendar.status) : null;
    calendar.work_type ? params = params.append('work_type', calendar.work_type) : null;
    calendar.initial_date ? params = params.append('initial_date', initial_date) : null;
    calendar.final_date ? params = params.append('final_date', final_date) : null;
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

  // Delete Task
  closeTask(id: number) : Observable<Task>{
    return this.http.post<Task>(`${this.baseUrl}/tasks/${id}/close`,{})
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

  // Get Tasks
  getTaskAll() : Observable<ModelTask> {
    return this.http.get<ModelTask>(`${this.baseUrl}/tasks/`)
  }

  // Get Doors
  getDoorsAll() : Observable<DoorDetailTask> {
    return this.http.get<DoorDetailTask>(`${this.baseUrl}/doors/?not_paginate=true`)
  }

  // Get Repairs
  getProductsAll(id : number) : Observable<ModelProduct> {
    let params = new HttpParams();
    params = params.append('not_paginate',true);
    params = params.append('category','repair');
    id ? params = params.append('job_center', id) : null;
    return this.http.get<ModelProduct>(`${this.baseUrl}/products/`, {params});
  }

  // Add Product by Task
  addProductByTask(id : number , productByTask: ProductByTask): Observable<TaskDetail> {
    return this.http.post<TaskDetail>(`${this.baseUrl}/tasks/${id}/product`, productByTask)
  }

  // Delete Product by Task
  deleteProductByTask(id: number, idProduct: number) : Observable<TaskDetail>{
    return this.http.delete<TaskDetail>(`${this.baseUrl}/tasks/${id}/product/${idProduct}`)
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

  /**
   * Calendar
   * @param type
   * @param filterTask
   */
  reportCalendarPdf(type: string , filterTask: reportTask) : Observable<any> {
    let route;
    if (type === 'Completo') route = 'task-calendar-report';
    if (type === 'Por-Finalizar') route = 'task-pending-report';
    let initial_date = this.dateService.getFormatDataDate(filterTask.initial_date)
    let final_date = this.dateService.getFormatDataDate(filterTask.final_date)
    let customer = String(filterTask.customer)
    let employee = String(filterTask.employee)
    let group = String(filterTask.job_center)
    let work_type = String(filterTask.work_type)
    let status = String(filterTask.status)
    let params = new HttpParams();
    params = params.append('initial_date', initial_date);
    params = params.append('final_date', final_date);
    params = params.append('customer', customer);
    params = params.append('employee', employee);
    params = params.append('group', group);
    params = params.append('work_type', work_type);
    params = params.append('status', status);
    return this.http.post(`${this.baseUrl}/${route}/`, '',{responseType: 'blob', params})
  }

  /**
   * Report Services Finalized
    */
  reportServiceFinalizedPdf(type: string, filterTask: reportTask) : Observable<any> {
    let route;
    if (type === 'Completo') route = 'task-finished-report';
    if (type === 'Basico') route = 'basic-task-finished-report';
    let initial_date = this.dateService.getFormatDataDate(filterTask.initial_date)
    let final_date = this.dateService.getFormatDataDate(filterTask.final_date)
    let customer = String(filterTask.customer)
    let employee = String(filterTask.employee)
    let group = String(filterTask.job_center)
    let work_type = String(filterTask.work_type)
    let door_id = String(filterTask.door_id)
    let params = new HttpParams();
    params = params.append('initial_date', initial_date);
    params = params.append('final_date', final_date);
    params = params.append('customer', customer);
    params = params.append('employee', employee);
    params = params.append('group', group);
    params = params.append('work_type', work_type)
    params = params.append('door_id', door_id)
    return this.http.post(`${this.baseUrl}/${route}/`, '',{responseType: 'blob', params})
  }

  // Report Services Finalized
  reportServiceFinalizedExcel(filterTask: reportTask) : Observable<any> {
    let initial_date = this.dateService.getFormatDataDate(filterTask.initial_date)
    let final_date = this.dateService.getFormatDataDate(filterTask.final_date)
    let customer = String(filterTask.customer)
    let employee = String(filterTask.employee)
    let group = String(filterTask.job_center)
    let work_type = String(filterTask.work_type)
    let door_id = String(filterTask.door_id)
    let params = new HttpParams();
    params = params.append('initial_date', initial_date);
    params = params.append('final_date', final_date);
    params = params.append('customer', customer);
    params = params.append('employee', employee);
    params = params.append('group', group);
    params = params.append('work_type', work_type)
    params = params.append('door_id', door_id)
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

  // Add Refund
  addRefundByConceptByTask(id : number , data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/tasks/refund/product/${id}`, data)
  }

}
