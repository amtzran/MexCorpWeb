import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {EmployeeService} from "../../services/employee.service";
import {EmployeeDetail, Job, JobCenter} from "../../interfaces/employee.interface";
import {ModalResponse} from "../../../../core/utils/ModalResponse";
import {SharedService} from "../../../../shared/services/shared.service";
import {NgxSpinnerService} from "ngx-spinner";
import {DataPermission} from "../../../../shared/interfaces/shared.interface";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {CrudToolComponent} from "../crud-tool/crud-tool.component";
import {ConfirmComponent} from "../../../../shared/components/confirm/confirm.component";
import {Product} from "../../../catalog/tools-services/interfaces/product.interface";
import {Turn} from "../../../catalog/turns/interfaces/turn.interface";
import {DateService} from "../../../../core/utils/date.service";

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
  turns: Turn[] = [];
  permissions!: DataPermission[];

  /**
   * Table Tools Files
   */
  displayedColumns: string[] = ['id', 'name', 'description', 'brand', 'cost', 'quantity', 'options'];
  dataSource!: MatTableDataSource<EmployeeDetail>;
  totalItems!: number;
  pageSize = 30;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private dialogRef: MatDialogRef<CrudComponent>,
    private employeeService: EmployeeService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private dateService: DateService,
    @Inject(MAT_DIALOG_DATA) public employee : {idEmployee: number, edit: boolean, info: boolean}
  ) { }

  ngOnInit(): void {
    // Service selects
    this.employeeService.getJobCenters().subscribe(jobCenters => {this.jobCenters = jobCenters.data} )
    this.employeeService.getJobs().subscribe(jobs => {this.jobs = jobs.data} )
    this.employeeService.getTurns().subscribe(turns => {this.turns = turns.data} )
    this.sharedService.getPermissions().subscribe( permissions => {this.permissions = permissions.data})

    /*Formulario*/
    this.loadEmployeeForm();

    if(this.employee.idEmployee && this.employee.edit){
      this.title = 'Editar Empleado';
      this.employeeForm.updateValueAndValidity();
    }

    if(this.employee.idEmployee && !this.employee.edit){
      this.title = 'Información del Empleado';
      this.employeeForm.updateValueAndValidity();
    }

    if(this.employee.idEmployee){
      this.loadEmployeeById();
    }

    this.dataSource = new MatTableDataSource();
    if (this.employee.edit) this.getToolsPaginator(this.paginator);

  }

  /**
   * Get detail retrieve of one group.
   */
  loadEmployeeById(): void{
    this.spinner.show()
    this.employeeService.getEmployeeById(this.employee.idEmployee).subscribe((response) => {
      console.log(response)
      this.spinner.hide()
      this.employeeForm.patchValue({
        name: response.data.name,
        email: response.data.email,
        color: response.data.color,
        job_center_id: response.data.job_center_id,
        job_title_id: response.data.job_title_id,
        turn_id: response.data.turn_id,
        entry_radius: response.data.entry_radius,
        exit_radius: response.data.exit_radius,
        date_admission: this.dateService.getFormatDateSetInputRangePicker(response.data.date_admission!),
        nss: response.data.nss,
        curp: response.data.curp,
        rfc: response.data.rfc,
        validity: this.dateService.getFormatDateSetInputRangePicker(response.data.validity!),
        phone: response.data.phone,
        permissions_user: response.data.permissions_user.map( (permission: any) => permission.id),
        //products_employee: response.data.products_employee?.map( (product: any) => product.id)
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
      color:[{value: '#000000', disabled:this.employee.info}, Validators.required],
      signature:[{value:'', disabled:this.employee.info}],
      is_active:[{value:true, disabled:this.employee.info}],
      job_center_id: [{value: '', disabled:this.employee.info}, Validators.required],
      job_title_id: [{value: '', disabled:this.employee.info}, Validators.required],
      turn_id: [{value: '', disabled:this.employee.info}, Validators.required],
      entry_radius:[{value:false, disabled:this.employee.info}],
      exit_radius:[{value:false, disabled:this.employee.info}],
      date_admission:[{value:'', disabled:this.employee.info}, Validators.required],
      nss:[{value:'', disabled:this.employee.info}],
      curp:[{value:'', disabled:this.employee.info}],
      rfc:[{value:'', disabled:this.employee.info}],
      validity:[{value:'', disabled:this.employee.info}, Validators.required],
      phone:[{value:'', disabled:this.employee.info}],
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
      }))
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
    if (this.employeeForm.value.date_admission !== '') {
      let dateAdmission = this.dateService.getFormatDataDate(this.employeeForm.value.date_admission);
      this.employeeForm.get('date_admission')?.setValue(dateAdmission);
    }

    if (this.employeeForm.value.validity !== '') {
      let validity = this.dateService.getFormatDataDate(this.employeeForm.value.validity);
      this.employeeForm.get('validity')?.setValue(validity);
    }

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

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Get Data for table from Api
   * @param event
   */
  getToolsPaginator(event: any) {
    this.spinner.show()
    this.employeeService.getEmployeeById(this.employee.idEmployee)
      .subscribe(res => {
          this.spinner.hide()
          this.dataSource.data = res.data.products_employee
        }, (error => {
          this.spinner.hide()
          this.sharedService.errorDialog(error)
        })
      )
  }

  /**
   * Open dialog for add and update Tools.
   * @param edit
   * @param data
   * @param info
   * @param idEmployee
   */
  openDialogTool(edit: boolean, data: Product | 0, info: boolean, idEmployee: number): void {
    const dialogRef = this.dialog.open(CrudToolComponent, {
      autoFocus: false,
      disableClose: true,
      width: '50vw',
      data: {edit: edit, data: data, info: info, idEmployee: idEmployee}
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === ModalResponse.UPDATE) {
        this.getToolsPaginator(this.paginator);
      }
    });
  }

  deleteTool(tool: any) {
    // Show Dialog
    const dialog = this.dialog.open(ConfirmComponent, {
      width: '25vw',
      data: tool
    })

    dialog.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.employeeService.deleteTool(this.employee.idEmployee, tool.id)
            .subscribe(resp => {
              this.sharedService.showSnackBar('Registro Eliminado')
              this.getToolsPaginator(this.paginator);
            })
        }
      })

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
