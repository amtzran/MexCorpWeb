import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Customer} from "../../../customer/interfaces/customer.interface";
import {SharedService} from "../../../../shared/services/shared.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ModalResponse} from "../../../../core/utils/ModalResponse";
import {TaskService} from "../../services/task.service";
import {Employee, JobCenter} from "../../../employee/interfaces/employee.interface";
import {WorkType} from "../../models/task.interface";
import {DateService} from "../../../../core/utils/date.service";

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styles: [
  ]
})
export class CrudComponent implements OnInit {

  /*Formulario*/
  taskForm!: FormGroup;

  /*Titulo Modal*/
  title: string = 'Nueva Tarea';

  /*Variables display errors modal*/
  showError!: boolean;
  submit!: boolean;

  // Fill Selects Contracts and Type customer
  customers: Customer[] = [];
  jobCenters: JobCenter[] = [];
  employees: Employee[] = [];
  workTypes: WorkType[] =[];

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private dialogRef: MatDialogRef<CrudComponent>,
    private _taskService: TaskService,
    private _dateService: DateService,
    @Inject(MAT_DIALOG_DATA) public task : {idTask: number, edit: boolean, info: boolean}
  ) { }

  ngOnInit(): void {

    // Customers init
    this._taskService.getCustomers()
      .subscribe(customers => {
        this.customers = customers.results
      } )

    // Type Customers
    this._taskService.getJobCenters()
      .subscribe(jobCenters => {
        this.jobCenters = jobCenters.results
      } )

    // Type Employees
    this._taskService.getEmployees()
      .subscribe(employees => {
        this.employees = employees.results
      } )

    // Type Customers
    this._taskService.getWorkTypes()
      .subscribe(workTypes => {
        this.workTypes = workTypes.results
      } )

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

  }

  /**
   * Get detail retrieve of one group.
   */
  loadTaskById(): void{
    this._taskService.getTaskById(this.task.idTask).subscribe(response => {
      //delete response.id;
      //delete response.created_at;
      //delete response.updated_at;
      this.taskForm.setValue(response);
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
      initial_date: [{value: '', disabled:this.task.info}, Validators.required],
      final_date: [{value: '', disabled:this.task.info}, Validators.required],
      initial_hour: [{value: '', disabled:this.task.info}, Validators.required],
      final_hour: [{value: '', disabled:this.task.info}, Validators.required],
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
    let initialDate = this._dateService.getFormatDataDate(this.taskForm.get('initial_date')?.value)
    this.taskForm.get('initial_date')?.setValue(initialDate)
    let finalDate = this._dateService.getFormatDataDate(this.taskForm.get('final_date')?.value)
    this.taskForm.get('final_date')?.setValue(finalDate)
    this._taskService.addTask(this.taskForm.value).subscribe(response => {
      this.sharedService.showSnackBar('Se ha agregado correctamente la tarea.');
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
    this._taskService.updateTask(this.task.idTask, this.taskForm.value).subscribe(response => {
      this.sharedService.showSnackBar(`Se ha actualizado correctamente la Tarea:` );
      this.dialogRef.close(ModalResponse.UPDATE);
    })
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
    this.dialogRef.close(ModalResponse.UPDATE);
  }

}
