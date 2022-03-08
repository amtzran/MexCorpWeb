import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {EmployeeService} from "../../services/employee.service";
import {Job, JobCenter} from "../../interfaces/employee.interface";
import {ModalResponse} from "../../../../core/utils/ModalResponse";
import {SharedService} from "../../../../shared/services/shared.service";
import {NgxSpinnerService} from "ngx-spinner";
import {DataPermission} from "../../../../shared/interfaces/shared.interface";

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
  permissions!: DataPermission[];

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private dialogRef: MatDialogRef<CrudComponent>,
    private employeeService: EmployeeService,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public employee : {idEmployee: number, edit: boolean, info: boolean}
  ) { }

  ngOnInit(): void {
    // Service selects
    this.employeeService.getJobCenters().subscribe(jobCenters => {this.jobCenters = jobCenters.data} )
    this.employeeService.getJobs().subscribe(jobs => {this.jobs = jobs.data} )
    this.sharedService.getPermissions().subscribe( permissions => {this.permissions = permissions.data})

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
    this.spinner.show()
    this.employeeService.getEmployeeById(this.employee.idEmployee).subscribe(response => {
      this.spinner.hide()
      delete response.data.id;
      delete response.data.user_id;
      delete response.data.created_at;
      delete response.data.updated_at;
      delete response.data.job_center_name;
      delete response.data.job_title_name;
      delete response.data.user_name;
      delete response.data.avatar;
      this.employeeForm.setValue(response.data);
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      } )
    )
  }

  /**
   * Load the form group.
   */
  loadEmployeeForm():void{
    this.employeeForm = this.fb.group({
      name:[{value:null, disabled:this.employee.info}, Validators.required],
      email:[{value:null, disabled:this.employee.info}, [Validators.required, Validators.email]],
      color:[{value:null, disabled:this.employee.info}, Validators.required],
      signature:[{value:'', disabled:this.employee.info}],
      is_active:[{value:true, disabled:this.employee.info}],
      job_center_id: [{value: '', disabled:this.employee.info}, Validators.required],
      job_title_id: [{value: '', disabled:this.employee.info}, Validators.required],
      permissions_user:[{value: [], disabled:this.employee.info}, Validators.required],
    });
  }

  /**
   * Create employee.
   */
  addEmployee(): void {
    this.validateForm()
    this.spinner.show()
    this.employeeService.addEmployee(this.employeeForm.value).subscribe(response => {
      this.spinner.hide()
      this.sharedService.showSnackBar('Se ha agregado correctamente el empleado.');
      this.dialogRef.close(ModalResponse.UPDATE);
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      } )
    )
  }

  /**
   * Update a employee.
   */
  updateEmployee(): void {
    this.validateForm()
    this.spinner.show()
    this.employeeService.updateEmployee(this.employee.idEmployee, this.employeeForm.value).subscribe(response => {
      this.spinner.hide()
      this.sharedService.showSnackBar(`Se ha actualizado correctamente el empleado: ${response.data.name}` );
      this.dialogRef.close(ModalResponse.UPDATE);
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      } )
    )
  }

  /**
   * Validate form in general
   */
  validateForm(){
    this.submit = true;
    if(this.employeeForm.invalid){
      this.sharedService.showSnackBar('Los campos con * son obligatorios.');
      return
    }
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

  /**
   * Function for set value in select multiple with json
   * Error Documentation versión 13.1.1
   * @param objInitial
   * @param objSelected
   */
  setValueSelectObjectMultiple(objInitial: any, objSelected: any) : any {

    if (typeof objInitial !== 'undefined' && typeof objSelected.id !== 'undefined') {
      return objInitial && objSelected.id ? objInitial === objSelected.id : objInitial === objSelected.id;
    }
  }

}
