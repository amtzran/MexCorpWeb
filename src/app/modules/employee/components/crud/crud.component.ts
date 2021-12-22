import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {EmployeeService} from "../../services/employee.service";
import {Job, JobCenter} from "../../interfaces/employee.interface";
import {ModalResponse} from "../../../../core/utils/ModalResponse";
import {SharedService} from "../../../../shared/services/shared.service";

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styles: [
  ]
})
export class CrudComponent implements OnInit {

  /*Formulario*/
  employeeForm!: FormGroup;

  /*Titulo Modal*/
  title: string = 'Nuevo Empleado';

  /*Variables display errors modal*/
  showError!: boolean;
  submit!: boolean;

  // Fill Selects Job Centers and Jobs
  jobCenters: JobCenter[] = [];
  jobs: Job[] = []

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private dialogRef: MatDialogRef<CrudComponent>,
    private _employeeService: EmployeeService,
    @Inject(MAT_DIALOG_DATA) public employee : {idEmployee: number, edit: boolean, info: boolean}
  ) { }

  ngOnInit(): void {

    // Job Centers
    this._employeeService.getJobCenters()
      .subscribe(jobCenters => {
        this.jobCenters = jobCenters.results
      } )

    // Type Jobs
    this._employeeService.getJobs()
      .subscribe(jobs => {
        this.jobs = jobs.results
      } )

    /*Formulario*/
    this.loadEmployeeForm();

    if(this.employee.idEmployee && this.employee.edit){
      this.title = 'Editar Cliente';
      this.employeeForm.updateValueAndValidity();
    }

    if(this.employee.idEmployee && !this.employee.edit){
      this.title = 'Información del Cliente';
      this.employeeForm.updateValueAndValidity();
    }

    if(this.employee.idEmployee){
      this.loadEmployeeById();
    }

  }

  /**
   * Get detail retrieve of one group.
   */
  loadEmployeeById(): void{
    this._employeeService.getEmployeeById(this.employee.idEmployee).subscribe(response => {
      delete response.id;
      //delete response.created_at;
      //delete response.updated_at;
      this.employeeForm.setValue(response);
    })
  }

  /**
   * Load the form group.
   */
  loadEmployeeForm():void{
    this.employeeForm = this.fb.group({
      name:[{value:null, disabled:this.employee.info}, Validators.required],
      color:[{value:null, disabled:this.employee.info}, Validators.required],
      avatar:[{value:'', disabled:this.employee.info}],
      signature:[{value:'', disabled:this.employee.info}],
      job_center: [{value: '', disabled:this.employee.info}, Validators.required],
      job: [{value: '', disabled:this.employee.info}, Validators.required],
      user: [{value: 1, disabled:this.employee.info}],
    });
  }

  /**
   * Create employee.
   */
  addEmployee(): void {
    this.submit = true;
    if(this.employeeForm.invalid){
      this.sharedService.showSnackBar('Los campos con * son obligatorios.');
      return
    }
    this._employeeService.addEmployee(this.employeeForm.value).subscribe(response => {
      this.sharedService.showSnackBar('Se ha agregado correctamente el empleado.');
      this.dialogRef.close(ModalResponse.UPDATE);
    })
  }

  /**
   * Update a employee.
   */
  updateEmployee(): void {
    this.submit = true;
    if(this.employeeForm.invalid){
      this.sharedService.showSnackBar('Los campos con * son obligatorios.');
      return
    }
    this._employeeService.updateEmployee(this.employee.idEmployee, this.employeeForm.value).subscribe(response => {
      this.sharedService.showSnackBar(`Se ha actualizado correctamente el empleado: ${response.name}` );
      this.dialogRef.close(ModalResponse.UPDATE);
    })
  }

  /**
   * Validations
   * @param field
   */
  fieldInvalid(field: string) {
    return this.employeeForm.get(field)?.invalid &&
      this.employeeForm.get(field)?.touched
  }

  /**
   * Close modal.
   */
  close(): void{
    this.dialogRef.close(ModalResponse.UPDATE);
  }

}
