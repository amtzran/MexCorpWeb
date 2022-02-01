import { Component, OnInit } from '@angular/core';
import {TaskService} from "../../../task/services/task.service";
import {ReportService} from "../../services/report.service";
import {Customer} from "../../../customer/customers/interfaces/customer.interface";
import {Employee, JobCenter} from "../../../employee/interfaces/employee.interface";
import * as fileSaver from "file-saver";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SharedService} from "../../../../shared/services/shared.service";
import {DateService} from "../../../../core/utils/date.service";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styles: [
  ]
})
export class TableComponent implements OnInit {

  // Filters
  customers: Customer[] = [];
  jobCenters: JobCenter[] = [];
  employees: Employee[] = [];
  reportForm!: FormGroup;
  submit!: boolean;

  constructor(private taskService: TaskService,
              private reportService: ReportService,
              private formBuilder: FormBuilder,
              private sharedService: SharedService,
              private dateService: DateService,
              private spinner: NgxSpinnerService,) { }

  ngOnInit(): void {
    // Type Customers
    this.taskService.getCustomers().subscribe(customers => {this.customers = customers.data} )
    // Type Groups
    this.taskService.getJobCenters().subscribe(jobCenters => {this.jobCenters = jobCenters.data} )
    // Type Employees
    this.taskService.getEmployees().subscribe(employees => {this.employees = employees.data} )
    // Form
    this.loadReportForm()
  }

  /**
   * load Form Reactive Form
   */
  loadReportForm() : void {
    this.reportForm = this.formBuilder.group({
      initial_date: [{value: '', disabled:false}, Validators.required],
      final_date: [{value: '', disabled:false}, Validators.required],
      customer: [{value: '', disabled:false},],
      employee: [{value: '', disabled:false},],
      job_center: [{value: '', disabled:false},],
      status : [{value: '', disabled:false},]
    });
  }

  /**
   * Export Excel and Pdf with filters
   * @param type
   */
  downloadReport(type: string){
    this.validateForm()
    this.spinner.show()
    this.reportService.exportReportTask(this.reportForm.value, type).subscribe(res => {
      let file : any;
      if (type === 'excel') file = this.sharedService.createBlobToExcel(res);
      else file = this.sharedService.createBlobToPdf(res);

      let date_initial = this.dateService.getFormatDataDate(this.reportForm.value.initial_date)
      let final_date = this.dateService.getFormatDataDate(this.reportForm.value.final_date)

      fileSaver.saveAs(file, `Reporte-Tareas-${date_initial}-${final_date}`);

      this.spinner.hide()
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog()
      })
    )
  }

  /**
   * Validate form in general
   */
  validateForm(){
    this.submit = true;
    if(this.reportForm.invalid){
      this.sharedService.showSnackBar('Los campos con * son obligatorios.');
      return
    }
  }

  /**
   * Validations
   * @param field
   */
  fieldInvalid(field: string) {
    return this.reportForm.get(field)?.invalid && this.reportForm.get(field)?.touched
  }

}
