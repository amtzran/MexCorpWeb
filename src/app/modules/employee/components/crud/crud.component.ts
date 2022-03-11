import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {EmployeeService} from "../../services/employee.service";
import {Employee, Job, JobCenter} from "../../interfaces/employee.interface";
import {ModalResponse} from "../../../../core/utils/ModalResponse";
import {SharedService} from "../../../../shared/services/shared.service";
import {NgxSpinnerService} from "ngx-spinner";
import {DataPermission} from "../../../../shared/interfaces/shared.interface";
import {Product} from "../../../catalog/product/interfaces/product.interface";

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
  products!: Product[];

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
    this.employeeService.getProducts().subscribe(products => {this.products = products.data})
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
      this.employeeForm.patchValue({
        name: response.data.name,
        email: response.data.email,
        color: response.data.color,
        job_center_id: response.data.job_center_id,
        job_title_id: response.data.job_title_id,
        permissions_user: response.data.permissions_user.map( (permission: any) => permission.id),
        products_employee: response.data.products_employee?.map( (product: any) => product.id)
      })
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
      products_employee:[{value: [], disabled:this.employee.info}],
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

    if (typeof objInitial !== 'undefined' && typeof objSelected !== 'undefined') {
      return objInitial && objSelected ? objInitial === objSelected : objInitial === objSelected;
    }
  }

}
