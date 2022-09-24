import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Customer} from "../../../customer/customers/interfaces/customer.interface";
import {SharedService} from "../../../../shared/services/shared.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ModalResponse} from "../../../../core/utils/ModalResponse";
import {TaskService} from "../../services/task.service";
import {Employee, JobCenter} from "../../../employee/interfaces/employee.interface";
import {CalendarDate, DoorByTask, Task, WorkType} from "../../models/task.interface";
import {DateService} from "../../../../core/utils/date.service";
import {Door, DoorType} from "../../../customer/doors/interfaces/door.interface";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {NgxSpinnerService} from "ngx-spinner";
import {ConfirmComponent} from "../../../../shared/components/confirm/confirm.component";
import * as moment from "moment";
import {SendEmailComponent} from "../send-email/send-email.component";
import {ImageDetailComponent} from "../image-detail/image-detail.component";
import {Product} from "../../../catalog/tools-services/interfaces/product.interface";
import {ReceivePartComponent} from "../receive-part/receive-part.component";

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styles: [],
  styleUrls: ['./crud.component.css']
})
export class CrudComponent implements OnInit {

  /*Formulario*/
  taskForm!: FormGroup;
  productForm!: FormGroup;
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
  jobCenters!: JobCenter[];
  employees!: Employee[];
  workTypes!: WorkType[];
  doorTypes!:  DoorType[];
  products!: Product[];
  taskId!: number;
  jobCenterId!: number;
  dataTask!: Task;

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

  displayedColumnsProducts: string[] = ['id', 'product', 'quantity', 'amount_spent', 'refund', 'status', 'options'];
  dataSourceProducts!: MatTableDataSource<any>;

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private dialogRef: MatDialogRef<CrudComponent>,
    private dialog: MatDialog,
    private taskService: TaskService,
    private dateService: DateService,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public task : {
      idTask: number,
      edit: boolean,
      info: boolean,
      calendar: CalendarDate,
      eventDrag: boolean,
      eventDragUpdate: boolean,
      multiple: boolean,
      editCustom: boolean
    }
  ) { }

  ngOnInit(): void {
    this.taskId = this.task.idTask
    // Customers
    this.loadDataCustomers()

    // Type Job Centers
    this.taskService.getJobCenters().subscribe(jobCenters => {this.jobCenters = jobCenters.data})

    // Type Employees
    this.taskService.getEmployees().subscribe(employees => {this.employees = employees.data} )

    // Type Customers
    this.taskService.getWorkTypes().subscribe(workTypes => {this.workTypes = workTypes.data} );

    /*Formulario*/
    this.loadTaskForm();
    this.loadProductForm();
    this.updateEventSharedService();

    /**
     * If show type form
     */
    if(this.task.idTask && this.task.edit){
      this.title = 'Editar Tarea';
      this.taskForm.updateValueAndValidity();
    }

    if(this.task.idTask && !this.task.edit) this.taskForm.updateValueAndValidity();
    if(this.task.idTask && !this.task.eventDrag) this.loadTaskById();
    if(this.task.idTask && this.task.eventDrag) this.loadTaskByIdDrag();
    if (this.task.calendar != null) this.loadTaskFormDate()

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
    this.dataSourceProducts = new MatTableDataSource();
    //this.loadDoorFilterForm();

    //this.getProductsPaginator(this.paginatorProducts);
    if (this.task.info) this.getDoorsPaginator(this.paginator);
  }

  // Data Customers
  loadDataCustomers(){
    this.taskService.getCustomers().subscribe(customers => {this.customers = customers.data} );
  }

  /**
   * Get detail retrieve of one Task.
   */
  loadTaskById(): void{
    this.spinner.show()
    this.taskService.getTaskById(this.taskId).subscribe((response) => {
      this.dataTask = response.data
      this.title = `Información de la Tarea | ${response.data.status} | ${response.data.folio}
      | ${response.data.invoiced === 1 ? 'Facturado' : 'Sin Facturar'}`;
      // Data Doors by Customer
      this.loadAccess(response.data.customer_id)
      this.taskForm.patchValue({
        title: response.data.title,
        employee_id: response.data.employee_id,
        job_center_id: response.data.job_center_id,
        customer_id: response.data.customer_id,
        doors: response.data.doors.map( (door :any) => door.id),
        comments: response.data.comments,
        work_type_id: response.data.work_type_id,
        initial_hour: response.data.initial_hour,
        final_hour: response.data.final_hour,
        initial_date: this.dateService.getFormatDateSetInputRangePicker(response.data.initial_date!),
        final_date: this.dateService.getFormatDateSetInputRangePicker(response.data.final_date!)
      });
      this.dataSourceProducts.data = response.data.products;
      this.jobCenterId = response.data.job_center_id;
      this.loadDataProducts(response.data.job_center_id);
      this.spinner.hide();
    }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      }))
  }

  /**
   * Get detail retrieve of one EventDrag Task.
   */
  loadTaskByIdDrag(): void{
    this.spinner.show()
    this.taskService.getTaskById(this.task.idTask).subscribe(response => {
      this.spinner.hide()
      // Data Doors by Customer
      this.loadAccess(response.data.customer_id)
      this.taskForm.patchValue({
        title: response.data.title,
        employee_id: response.data.employee_id,
        job_center_id: response.data.job_center_id,
        customer_id: response.data.customer_id,
        doors: response.data.doors.map( (door: any) => door.id),
        comments: response.data.comments,
        work_type_id: response.data.work_type_id,
        initial_hour: this.task.calendar.initial_hour,
        final_hour: this.task.calendar.final_hour,
        initial_date: this.task.calendar.initial_date,
        final_date: this.task.calendar.final_date
      })
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      })
    )
  }

  /**
   * Load the form Task. from Button
   */
  loadTaskForm():void{
    this.taskForm = this.fb.group({
      title:[{value:'', disabled:false}, Validators.required],
      job_center_id:[{value:'', disabled:false}, Validators.required],
      customer_id:[{value:'', disabled:this.task.info}, Validators.required],
      employee_id:[{value:'', disabled:false}, Validators.required],
      work_type_id:[{value:'', disabled:false}, Validators.required],
      doors:[{value: [], disabled:this.task.info}, Validators.required],
      initial_hour: [{value: '', disabled:this.task.info}, Validators.required],
      final_hour: [{value: '', disabled:this.task.info}, Validators.required],
      comments: [{value: '', disabled:false},],
      dates: [{value: [], disabled:this.task.info}, Validators.required],
    });
    if (!this.task.multiple) {
      this.taskForm.addControl('initial_date', new FormControl(
        {
          value: '',
          disabled: this.task.info
        },
        [
          Validators.required,
        ]
      ))
      this.taskForm.addControl('final_date', new FormControl(
        {
          value: '',
          disabled: this.task.info
        },
        [
          Validators.required,
        ]
      ))
    }
  }

  /**
   * Load the form Task. from Button
   */
  loadProductForm():void{
    this.productForm = this.fb.group({
      product_id:[{value:'', disabled:false}, Validators.required],
      quantity:[{value:'', disabled:false}, Validators.required],
    });
  }

  /**
   * Load the form Task Click Data and Hour.
   */
  loadTaskFormDate():void{
    this.taskForm = this.fb.group({
      title:[{value:'', disabled:false}, Validators.required],
      job_center_id:[{value:'', disabled:false}, Validators.required],
      customer_id:[{value:'', disabled:this.task.info}, Validators.required],
      employee_id:[{value:'', disabled:false}, Validators.required],
      work_type_id:[{value:'', disabled:false}, Validators.required],
      doors:[{value: [], disabled:this.task.info}, Validators.required],
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
    this.setValueSubmit()
    this.spinner.show()
    if (this.task.multiple) {
      let convertDate: any = [];
      this.taskForm.value.dates?.forEach(function (value : any) : string {
        return convertDate.push(moment(new Date(value)).format('YYYY-MM-DD').toString())
      })
      this.taskForm.value.dates = convertDate;
      this.taskService.multipleTask(this.taskForm.value).subscribe(response => {
          this.spinner.hide()
          this.sharedService.showSnackBar(`Se ha agregado correctamente las Tareas.`);
          this.dialogRef.close(ModalResponse.UPDATE);
        }, (error => {
          this.spinner.hide()
          this.sharedService.errorDialog(error)
        })
      )
    }
    else {
      this.taskService.addTask(this.taskForm.value).subscribe(response => {
          this.taskId = response.data.id!;
          this.task.edit = true;
          this.spinner.hide()
          this.sharedService.showSnackBar(`Se ha agregado correctamente la Tarea: ${response.data.title}`);
          this.loadTaskById();
        }, (error => {
          this.spinner.hide()
          this.sharedService.errorDialog(error)
        })
      )
    }

  }

  /**
   * Update a task.
   */
  updateTask(): void {
    this.setValueSubmit()
    this.spinner.show()
    // Set Date for Input.
    let initialDate = this.dateService.getFormatDateSetInputRangePicker(this.taskForm.value.initial_date);
    let finalDate = this.dateService.getFormatDateSetInputRangePicker(this.taskForm.value.final_date);
    this.taskForm.get('initial_date')?.setValue(initialDate);
    this.taskForm.get('final_date')?.setValue(finalDate);
    this.taskService.updateTask(this.taskId, this.taskForm.value).subscribe(response => {
      this.spinner.hide()
      this.sharedService.showSnackBar(`Se ha actualizado correctamente la Tarea: ${response.data.title}` );
      this.dialogRef.close(ModalResponse.UPDATE);
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      })
    )
  }

  /**
   * Update a task Custom Finalized.
   */
  updateTaskCustom(): void {
    this.setValueSubmit()
    this.spinner.show()

    this.dataTask.title = this.taskForm.value.title
    this.dataTask.job_center_id = this.taskForm.value.job_center_id
    this.dataTask.work_type_id = this.taskForm.value.work_type_id
    this.dataTask.employee_id = this.taskForm.value.employee_id
    this.dataTask.comments = this.taskForm.value.comments
    this.dataTask.doors = this.dataTask.doors.map( (door: any) => door.id)

    this.taskService.updateTask(this.task.idTask, this.dataTask).subscribe(response => {
        this.spinner.hide()
        this.sharedService.showSnackBar(`Se ha actualizado correctamente la Tarea: ${response.data.title}` );
        this.dialogRef.close(ModalResponse.UPDATE);
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
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
          this.taskService.deleteTask(this.task.idTask).subscribe(response => {
            this.spinner.hide()
            this.sharedService.showSnackBar(`Se ha eliminado correctamente la Tarea`);
            this.sharedService.updateComponent()
            }, (error => {
              this.spinner.hide()
              this.sharedService.errorDialog(error)
            })
          )
        }
    })
  }

  /**
   *
   */
  saveProductByTask() {
    //this.validateForm()
    if (this.productForm.invalid) return;
    this.spinner.show()
    this.taskService.addProductByTask(this.taskId, this.productForm.value).subscribe((response) => {
        this.spinner.hide()
        this.sharedService.showSnackBar(`Se ha agregado correctamente la refacción`);
        this.loadTaskById();
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      }))
  }

  deleteProductByTask(product: any) {
    // Show Dialog
    const dialog = this.dialog.open(ConfirmComponent, {
      width: '50vw',
      data: product
    })

    dialog.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.taskService.deleteProductByTask(this.taskId, product.product_id!)
            .subscribe(resp => {
              this.sharedService.showSnackBar('Registro Eliminado');
              this.loadTaskById();
            }, (error => {
              this.spinner.hide()
              this.sharedService.errorDialog(error)
            }))
        }
      })

  }

  receivePartsByConcept(product: any) {
    // Show Dialog
    this.dialog.open(ReceivePartComponent, {
      width: '50vw',
      data: product
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
    this.initialDate = this.dateService.getFormatDataDate(this.taskForm.get('initial_date')?.value)
    this.taskForm.get('initial_date')?.setValue(this.initialDate)
    this.finalDate = this.dateService.getFormatDataDate(this.taskForm.get('final_date')?.value)
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
   * Event OnChange for get id Select
   * @param event
   */
  selectJobCenter(event: any) {
    this.loadDataProducts(event);
  }

  /**
   * Function Get Type Access By id Customer
   * @param idCustomer
   */
  loadAccess(idCustomer: number) {
    this.taskService.getDoorTypes(idCustomer).subscribe(
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
    this.taskService.getTaskByIdDoors(this.task.idTask)
      .subscribe(task => {
        this.spinner.hide()
        this.dataSource.data = task.data
        // TODO : Check Paginate
        //this.totalItems = task.meta.total;
        }, (error => {
          this.spinner.hide()
          this.sharedService.errorDialog(error)
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
   * Event click show url (Pdf)
   * @param doorTask
   * @param taskId
   */
  sendPdf(doorTask: DoorByTask, taskId: number){
    // Show Dialog
    const dialog = this.dialog.open(SendEmailComponent, {
      width: '40vw',
      data: {doorTask: doorTask, taskId: taskId}
    })

  }

  /**
   * Event click show url (Pdf)
   * @param doorTask
   */
  imgDetail(doorTask: DoorByTask){
    // Show Dialog
    const dialog = this.dialog.open(ImageDetailComponent, {
      width: '100vw',
      data: doorTask
    })

  }

  /**
   * Services Shared for update any Component
   */
  updateEventSharedService(){
    this.sharedService.changeEvent.subscribe(change => {
     this.loadTaskById();
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
    this.dialogRef.close(ModalResponse.CLOSE);
  }

  loadDataProducts(id: number) {this.taskService.getProductsAll(id).subscribe(products => {this.products = products.data} )}

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
