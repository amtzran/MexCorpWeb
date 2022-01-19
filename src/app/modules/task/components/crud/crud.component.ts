import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Customer} from "../../../customer/customers/interfaces/customer.interface";
import {SharedService} from "../../../../shared/services/shared.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ModalResponse} from "../../../../core/utils/ModalResponse";
import {TaskService} from "../../services/task.service";
import {Employee, JobCenter} from "../../../employee/interfaces/employee.interface";
import {CalendarDate, Task, WorkType} from "../../models/task.interface";
import {DateService} from "../../../../core/utils/date.service";
import {Door, DoorType} from "../../../customer/doors/interfaces/door.interface";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {NgxSpinnerService} from "ngx-spinner";
import {ConfirmComponent} from "../../../../shared/components/confirm/confirm.component";

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styles: []
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
  customers!: Customer[];
  //jobCenters!: Observable<JobCenter[]>;
  jobCenters!: JobCenter[];
  employees!: Employee[];
  workTypes!: WorkType[];
  doorTypes!:  DoorType[];

  /**
   * Table Access Files
   */
  displayedColumns: string[] = ['id', 'folio', 'name', 'door_type_name', 'options'];
  dataSource!: MatTableDataSource<Door>;
  totalItems!: number;
  pageSize = 30;
  doorPaginateForm!: FormGroup;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private dialogRef: MatDialogRef<CrudComponent>,
    private dialog: MatDialog,
    private _taskService: TaskService,
    private _dateService: DateService,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public task : {
      idTask: number,
      edit: boolean,
      info: boolean,
      calendar: CalendarDate,
      eventDrag: boolean,
      eventDragUpdate: boolean
    }
  ) { }

  ngOnInit(): void {
    // Customers init
    this._taskService.getCustomers().subscribe(customers => {this.customers = customers.data} )

    // Type Job Centers
    this._taskService.getJobCenters().subscribe(jobCenters => {
      this.jobCenters = jobCenters.data
      /*this.jobCentersFilter = jobCenters.data
      this.jobCenters = this.taskForm.valueChanges.pipe(
        startWith(''),
        map(value => (typeof value === 'string' ? value : value.name)),
        map(name => (name ? this._filter(name) : jobCenters.data.slice())),
      )*/
    })

    // Type Employees
    this._taskService.getEmployees().subscribe(employees => {this.employees = employees.data} )

    // Type Customers
    this._taskService.getWorkTypes().subscribe(workTypes => {this.workTypes = workTypes.data} )

    /*Formulario*/
    this.loadTaskForm();

    /**
     * If show type form
     */
    if(this.task.idTask && this.task.edit){
      this.title = 'Editar Tarea';
      this.taskForm.updateValueAndValidity();
    }

    if(this.task.idTask && !this.task.edit){
      this.taskForm.updateValueAndValidity();
    }

    if(this.task.idTask && !this.task.eventDrag){
      this.loadTaskById();
    }

    if(this.task.idTask && this.task.eventDrag){
      this.loadTaskByIdDrag();
    }

    if (this.task.calendar != null){
      this.loadTaskFormDate()
    }

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
    /*Formulario*/
    //this.loadDoorFilterForm();
    if (this.task.info) this.getDoorsPaginator(this.paginator);
  }

  /**
   * Get detail retrieve of one Task.
   */
  loadTaskById(): void{
    this.spinner.show()
    this._taskService.getTaskById(this.task.idTask).subscribe(response => {
      this.spinner.hide()
      this.title = `Información de la Tarea | ${response.data.status} | ${response.data.folio}`;
      // Data Doors by Customer
      this.loadAccess(response.data.customer_id)
      this.taskForm.patchValue({
        title: response.data.title,
        employee_id: response.data.employee_id,
        job_center_id: response.data.job_center_id,
        customer_id: response.data.customer_id,
        doors: response.data.doors.map( door => door.id),
        comments: response.data.comments,
        work_type_id: response.data.work_type_id,
        initial_hour: response.data.initial_hour,
        final_hour: response.data.final_hour,
        initial_date: this._dateService.getFormatDateSetInputRangePicker(response.data.initial_date),
        final_date: this._dateService.getFormatDateSetInputRangePicker(response.data.final_date)
      })
    }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog()
      })
    )
  }

  /**
   * Get detail retrieve of one EventDrag Task.
   */
  loadTaskByIdDrag(): void{
    this.spinner.show()
    this._taskService.getTaskById(this.task.idTask).subscribe(response => {
      this.spinner.hide()
      // Data Doors by Customer
      this.loadAccess(response.data.customer_id)
      this.taskForm.patchValue({
        title: response.data.title,
        employee_id: response.data.employee_id,
        job_center_id: response.data.job_center_id,
        customer_id: response.data.customer_id,
        doors: response.data.doors.map( door => door.id),
        comments: response.data.comments,
        work_type_id: response.data.work_type_id,
        initial_hour: this.task.calendar.initial_hour,
        final_hour: this.task.calendar.final_hour,
        initial_date: this.task.calendar.initial_date,
        final_date: this.task.calendar.final_date
      })
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog()
      })
    )
  }

  /**
   * Load the form Task. from Button
   */
  loadTaskForm():void{
    this.taskForm = this.fb.group({
      title:[{value:'', disabled:this.task.info}, Validators.required],
      job_center_id:[{value:'', disabled:this.task.info}, Validators.required],
      customer_id:[{value:'', disabled:this.task.info}, Validators.required],
      employee_id:[{value:'', disabled:this.task.info}, Validators.required],
      work_type_id:[{value:'', disabled:this.task.info}, Validators.required],
      doors:[{value: [], disabled:this.task.info}, Validators.required],
      initial_date: [{value: '', disabled:this.task.info}, Validators.required],
      final_date: [{value: '', disabled:this.task.info}, Validators.required],
      initial_hour: [{value: '', disabled:this.task.info}, Validators.required],
      final_hour: [{value: '', disabled:this.task.info}, Validators.required],
      comments: [{value: '', disabled:this.task.info},],
      //multiple_date: [{value: [], disabled:this.task.info},],
    });
  }

  /**
   * Load the form Task Click Data and Hour.
   */
  loadTaskFormDate():void{
    this.taskForm = this.fb.group({
      title:[{value:'', disabled:this.task.info}, Validators.required],
      job_center_id:[{value:'', disabled:this.task.info}, Validators.required],
      customer_id:[{value:'', disabled:this.task.info}, Validators.required],
      employee_id:[{value:'', disabled:this.task.info}, Validators.required],
      work_type_id:[{value:'', disabled:this.task.info}, Validators.required],
      doors:[{value: [], disabled:this.task.info}, Validators.required],
      initial_date: [{value: this.task.calendar.initial_date, disabled:this.task.info}, Validators.required],
      final_date: [{value: this.task.calendar.final_date, disabled:this.task.info}, Validators.required],
      initial_hour: [{value: this.task.calendar.initial_hour, disabled:this.task.info}, Validators.required],
      final_hour: [{value: this.task.calendar.final_hour, disabled:this.task.info}, Validators.required],
      comments: [{value: '', disabled:this.task.info},],
      //multiple_date: [{value: [], disabled:this.task.info},],
    });
  }

  /**
   * Create a Task.
   */
  addTask(): void {
    this.setValueSubmit()
    this.spinner.show()
    this._taskService.addTask(this.taskForm.value).subscribe(response => {
      this.spinner.hide()
      this.sharedService.showSnackBar(`Se ha agregado correctamente la Tarea: ${response.data.title}`);
      this.dialogRef.close(ModalResponse.UPDATE);
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog()
      })
    )
  }

  /**
   * Update a task.
   */
  updateTask(): void {
    this.setValueSubmit()
    this.spinner.show()
    this._taskService.updateTask(this.task.idTask, this.taskForm.value).subscribe(response => {
      this.spinner.hide()
      this.sharedService.showSnackBar(`Se ha actualizado correctamente la Tarea: ${response.data.title}` );
      this.dialogRef.close(ModalResponse.UPDATE);
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog()
      })
    )
  }

  /**
   * delete a task.
   */
  deleteTask(): void {
    // Show Dialog
    const dialog = this.dialog.open(ConfirmComponent, {
      width: '250',
      data: this.task
    })

    dialog.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.spinner.show()
          this._taskService.deleteTask(this.task.idTask).subscribe(response => {
            this.spinner.hide()
            this.sharedService.showSnackBar(`Se ha eliminado correctamente la Tarea`);
            this.sharedService.updateComponent()
            }, (error => {
              this.spinner.hide()
              this.sharedService.errorDialog()
            })
          )
        }
    })
  }

  /**
   * Value Submit Before send
   */
  setValueSubmit(){
    this.submit = true;
    if(this.taskForm.invalid){
      this.sharedService.showSnackBar('Los campos con * son obligatorios.');
      return
    }
    this.initialDate = this._dateService.getFormatDataDate(this.taskForm.get('initial_date')?.value)
    this.taskForm.get('initial_date')?.setValue(this.initialDate)
    this.finalDate = this._dateService.getFormatDataDate(this.taskForm.get('final_date')?.value)
    this.taskForm.get('final_date')?.setValue(this.finalDate)
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
   * Get Data for table from Api
   * @param event
   */
  getDoorsPaginator(event: any) {
    /*const paginator: MatPaginator = event;
    this.doorPaginateForm.get('page')?.setValue(paginator.pageIndex + 1);*/
    this.spinner.show()
    this._taskService.getTaskByIdDoors(this.task.idTask)
      .subscribe(task => {
        this.spinner.hide()
        this.dataSource.data = task.data
        // TODO : Check Paginate
        //this.totalItems = task.meta.total;
        }, (error => {
          this.spinner.hide()
          this.sharedService.errorDialog()
        })
      )
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

  displayFn(jobCenter: JobCenter): string {
    return jobCenter && jobCenter.name ? jobCenter.name : '';
  }

  private _filter(name: string): JobCenter[] {
    const filterValue = name.toLowerCase();

    return this.jobCenters.filter(option => option.name.toLowerCase().includes(filterValue));
  }

 /* /!* Método que permite iniciar los filtros de rutas*!/
  loadDoorFilterForm(): void {
    this.doorPaginateForm = this.fb.group({
      page: [],
      page_size: this.pageSize
    })
  }*/

  /**
   * Event click show url (Pdf)
   * @param reportPdf
   */
  viewPdf(reportPdf: string){
    window.open(reportPdf)
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
