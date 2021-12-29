import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Customer} from "../../../customer/customers/interfaces/customer.interface";
import {SharedService} from "../../../../shared/services/shared.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ModalResponse} from "../../../../core/utils/ModalResponse";
import {TaskService} from "../../services/task.service";
import {Employee, JobCenter} from "../../../employee/interfaces/employee.interface";
import {CalendarDate, WorkType} from "../../models/task.interface";
import {DateService} from "../../../../core/utils/date.service";
import {DoorType} from "../../../customer/doors/interfaces/door.interface";

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styles: [
  ]
})
export class CrudComponent implements OnInit {

  /*Formulario*/
  taskForm!: FormGroup;
  // Date Range
  initialDate: string = '';
  finalDate: string = '';

  /*Titulo Modal*/
  title: string = 'Nueva Tarea';

  /*Variables display errors modal*/
  showError!: boolean;
  submit!: boolean;

  // Fill Selects Crud
  customers: Customer[] = [];
  jobCenters: JobCenter[] = [];
  employees: Employee[] = [];
  workTypes: WorkType[] =[];
  doorTypes:  DoorType[] =[];

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private dialogRef: MatDialogRef<CrudComponent>,
    private _taskService: TaskService,
    private _dateService: DateService,
    @Inject(MAT_DIALOG_DATA) public task : {idTask: number, edit: boolean, info: boolean, calendar: CalendarDate}
  ) { }

  ngOnInit(): void {
    // Customers init
    this._taskService.getCustomers().subscribe(customers => {this.customers = customers.data} )

    // Type Customers
    this._taskService.getJobCenters().subscribe(jobCenters => {this.jobCenters = jobCenters.results} )

    // Type Employees
    this._taskService.getEmployees().subscribe(employees => {this.employees = employees.results} )

    // Type Customers
    this._taskService.getWorkTypes().subscribe(workTypes => {this.workTypes = workTypes.results} )

    /*Formulario*/
    this.loadTaskForm();

    if(this.task.idTask && this.task.edit){
      this.title = 'Editar Tarea';
      this.taskForm.updateValueAndValidity();
    }

    if(this.task.idTask && !this.task.edit){
      this.title = 'Información de la Tarea';
      this.taskForm.updateValueAndValidity();
    }

    if(this.task.idTask){
      this.loadTaskById();
    }

    if (this.task.calendar != null){
      this.loadTaskFormDate()
    }

  }

  /**
   * Get detail retrieve of one group.
   */
  loadTaskById(): void{
    this._taskService.getTaskById(this.task.idTask).subscribe(response => {
      this.taskForm.patchValue({
        title: response.title,
        employee: response.employee,
        job_center: response.job_center,
        customer: response.customer,
        //door_type: response.door_type,
        comments: response.comments,
        work_type: response.work_type,
        initial_hour: response.initial_hour,
        final_hour: response.final_hour,
        initial_date: this._dateService.getFormatDateSetInputRangePicker(response.initial_date),
        final_date: this._dateService.getFormatDateSetInputRangePicker(response.final_date)
      })
      //this.taskForm.setValue(response);
    })
  }

  /**
   * Load the form group.
   */
  loadTaskForm():void{
    this.taskForm = this.fb.group({
      title:[{value:'', disabled:this.task.info}],
      job_center:[{value:'', disabled:this.task.info}, Validators.required],
      customer:[{value:'', disabled:this.task.info}, Validators.required],
      employee:[{value:'', disabled:this.task.info}, Validators.required],
      work_type:[{value:'', disabled:this.task.info}, Validators.required],
      //door_type:[{value: [], disabled:this.task.info}, Validators.required],
      initial_date: [{value: '', disabled:this.task.info}, Validators.required],
      final_date: [{value: '', disabled:this.task.info}, Validators.required],
      initial_hour: [{value: '', disabled:this.task.info}, Validators.required],
      final_hour: [{value: '', disabled:this.task.info}, Validators.required],
      comments: [{value: '', disabled:this.task.info},],
    });
  }

  /**
   * Load the form group.
   */
  loadTaskFormDate():void{
    this.taskForm = this.fb.group({
      title:[{value:'', disabled:this.task.info}, Validators.required],
      job_center:[{value:'', disabled:this.task.info}, Validators.required],
      customer:[{value:'', disabled:this.task.info}, Validators.required],
      employee:[{value:'', disabled:this.task.info}, Validators.required],
      work_type:[{value:'', disabled:this.task.info}, Validators.required],
      //door_type:[{value: [], disabled:this.task.info}, Validators.required],
      initial_date: [{value: this.task.calendar.initial_date, disabled:this.task.info}, Validators.required],
      final_date: [{value: this.task.calendar.final_date, disabled:this.task.info}, Validators.required],
      initial_hour: [{value: this.task.calendar.initial_hour, disabled:this.task.info}, Validators.required],
      final_hour: [{value: this.task.calendar.final_hour, disabled:this.task.info}, Validators.required],
      comments: [{value: '', disabled:this.task.info},],
    });
  }

  /**
   * Create a Task.
   */
  addTask(): void {
    this.submit = true;
    if(this.taskForm.invalid){
      this.sharedService.showSnackBar('Los campos con * son obligatorios.');
      return
    }
    this.initialDate = this._dateService.getFormatDataDate(this.taskForm.get('initial_date')?.value)
    this.taskForm.get('initial_date')?.setValue(this.initialDate)
    this.finalDate = this._dateService.getFormatDataDate(this.taskForm.get('final_date')?.value)
    this.taskForm.get('final_date')?.setValue(this.finalDate)
    this._taskService.addTask(this.taskForm.value).subscribe(response => {
      this.sharedService.showSnackBar(`Se ha agregado correctamente la Tarea: ${response.title}`);
      this.dialogRef.close(ModalResponse.UPDATE);
    })
  }

  /**
   * Update a task.
   */
  updateTask(): void {
    this.submit = true;
    if(this.taskForm.invalid){
      this.sharedService.showSnackBar('Los campos con * son obligatorios.');
      return
    }
    this.initialDate = this._dateService.getFormatDataDate(this.taskForm.get('initial_date')?.value)
    this.taskForm.get('initial_date')?.setValue(this.initialDate)
    this.finalDate = this._dateService.getFormatDataDate(this.taskForm.get('final_date')?.value)
    this.taskForm.get('final_date')?.setValue(this.finalDate)
    this._taskService.updateTask(this.task.idTask, this.taskForm.value).subscribe(response => {
      this.sharedService.showSnackBar(`Se ha actualizado correctamente la Tarea: ${response.title}` );
      this.dialogRef.close(ModalResponse.UPDATE);
    })
  }

  /**
   * Event OnChange for get id Select
   * @param idCustomer
   */
  selectCustomer(idCustomer: number): void {
    this.loadAccess(idCustomer)
  }

  /**
   * Function Get Type Access By id Customer
   * @param idCustomer
   */
  loadAccess(idCustomer: number) {
    this._taskService.getDoorTypes(idCustomer).subscribe(
      doorTypesByCustomer => {
        this.doorTypes = doorTypesByCustomer.data
        if (this.doorTypes.length === 0) {
          this.sharedService.showSnackBar('No ha Seleccionado ningún Cliente')
        }
      }
    )
  }

  /**
   * Validations
   * @param field
   */
  fieldInvalid(field: string) {
    return this.taskForm.get(field)?.invalid &&
      this.taskForm.get(field)?.touched
  }

  /**
   * Close modal.
   */
  close(): void{
    this.dialogRef.close(ModalResponse.CLOSE);
  }

}
