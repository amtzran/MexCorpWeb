import {AfterViewInit, Component, ElementRef, forwardRef, OnInit, ViewChild} from '@angular/core';
import {Calendar, CalendarOptions, DateSelectArg, EventClickArg, FullCalendarComponent} from "@fullcalendar/angular";
import {CalendarDate, ModelTask, Task} from "../../models/task.interface";
import {TaskService} from "../../services/task.service";
import {MatDialog} from "@angular/material/dialog";
import * as moment from "moment";
import {CrudComponent} from "../crud/crud.component";
import {EventApi, EventDropArg} from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {NgxSpinnerService} from "ngx-spinner";
import {SharedService} from "../../../../shared/services/shared.service";
import {Customer} from "../../../customer/customers/interfaces/customer.interface";
import {Employee, JobCenter} from "../../../employee/interfaces/employee.interface";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import * as fileSaver from "file-saver";
import {DateService} from "../../../../core/utils/date.service";
import {WorkType} from "../../../catalog/work-types/models/work-type.interface";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ConfirmComponent} from "../../../../shared/components/confirm/confirm.component";
import {ModalResponse} from "../../../../core/utils/ModalResponse";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
  /*styles: [``]*/
})
export class TableComponent implements OnInit, AfterViewInit {
  // Declare any for model EventApi
  tasks: any = []
  calendarOptions!: CalendarOptions
  // references the #calendar in the template
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  @ViewChild('external') external!: ElementRef;

  customers: Customer[] = [];
  jobCenters: JobCenter[] = [];
  employees: Employee[] = [];
  workTypes: WorkType[] = [];
  idCustomer : number | string = '';
  idEmployee : number | string = '';
  idJobCenter : number | string = '';
  status : number | string = '';
  changeEvent : boolean = true;
  calendarForm!: FormGroup;
  submit!: boolean;
  isChecked:boolean = true;

  // Values Initials Calendar
  headerToolbar = {
    left: 'prev,next,today,changeRange',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek,listDay'
  }

  // Values in Spanish Buttons
  buttonText = {
    today: 'Hoy',
    month: 'Mes',
    week: 'Semana',
    day: 'Día',
    list: 'Lista'
  }

  //This Values Ranges Date
  modeFull = true;

  // Variables Table Events
  displayedColumns: string[] = [
    'id',
    'folio',
    'title',
    'initial_date',
    'status',
    'customer_name',
    'employee_name',
    'job_center_name',
    'invoiced',
    'options'];
  dataSource!: MatTableDataSource<Task>;
  totalItems!: number;
  pageSize = this.sharedService.pageSize
  taskPaginateForm!: FormGroup;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private taskService: TaskService,
              private dialog: MatDialog,
              private spinner: NgxSpinnerService,
              private sharedService: SharedService,
              private formBuilder : FormBuilder,
              private dateService: DateService,) {}

  ngOnInit(): void {
    // Selects
    this.loadCalendarForm()
    // Service Selects
    this.loadDataCustomers()
    this.loadDataGroups()
    this.loadDataEmployees()
    this.loadDataWorkTypes()

    forwardRef(() => Calendar)
    // Valuers Initials Calendar
    this.initCalendar()
    // Events From Api
    this.initTaskCalendar()

    //Update Main Component
    this.updateEventSharedService()

    this.dataSource = new MatTableDataSource();
    /*Formulario*/
    this.loadTaskFilterForm();
    this.getTasksPaginator(this.paginator);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  /**
   * initialization Calendar Main View
   */
  initCalendar() {
    this.calendarOptions = {
      headerToolbar: this.headerToolbar,
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'timeGridWeek',
      events: this.tasks,
      weekends: true,
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      select: this.handleDateSelect.bind(this),
      eventClick: this.handleEventClick.bind(this),
      locale: 'es',
      timeZone: 'locale',
      eventsSet: this.handleEvents.bind(this),
      eventDrop: this.handleEventDrag.bind(this),
      buttonText: this.buttonText,
      slotMinTime: '08:00:00',
      slotMaxTime: '20:00:00',
      customButtons: {
        changeRange: {
          text: '12/24',
          click: this.customFunction.bind(this)
        }
      },
    };
  }

  /**
   * Get Date 12/24 Custom Button
   */
  customFunction() {
    if (this.modeFull) {
      this.calendarOptions.slotMinTime = '00:00:00';
      this.calendarOptions.slotMaxTime = '24:00:00';
      this.modeFull = false
    } else {
      this.calendarOptions.slotMinTime = '08:00:00';
      this.calendarOptions.slotMaxTime = '20:00:00';
      this.modeFull = true
    }
  }

  /**
   * Service for tasks in Calendar
   */
  initTaskCalendar(): void {
    this.spinner.show()
    this.taskService.getTasks(this.idCustomer, this.idEmployee, this.idJobCenter, this.status)
      .subscribe(tasks => {
        this.spinner.hide()
        tasks.data.forEach(element => {
          let color = element.color
          if (element.status === 'Finalizado') color = '#239B56'
          if (element.status === 'En Proceso') color = '#F39C12'
            this.tasks.push({
              id: String(element.id),
              title: `${element.title} -> Facturado: ${element.invoiced ? 'Si' : 'No'}`,
              start: `${element.initial_date} ${element.initial_hour}`,
              end: `${element.final_date} ${element.final_hour}`,
              backgroundColor: color,
              borderColor: color,
            })
        })
        this.initCalendar()
        }, (error => {
          this.spinner.hide()
          this.sharedService.errorDialog(error)
        } )
      )
  }


  /**
   * Update Calendar Date And Hour event dragging
   * @param selectInfoEventDrag
   */
  handleEventDrag(selectInfoEventDrag: EventDropArg) {

    const initialHour = moment(selectInfoEventDrag.event.startStr).format('HH:mm')
    const finalHour = moment(selectInfoEventDrag.event.endStr).format('HH:mm')
    const initialDate = selectInfoEventDrag.event.startStr
    const finalDate = selectInfoEventDrag.event.endStr

    const data: CalendarDate = {
      initial_hour: initialHour,
      final_hour: finalHour,
      initial_date: initialDate,
      final_date: finalDate
    }

    this.openDialogTask(true, Number(selectInfoEventDrag.event.id), false, data, true, false, false)

  }

  /**
   * Add New Event With info Calendar Date and Hour
   * @param selectInfo
   */
  handleDateSelect(selectInfo: DateSelectArg) {

    const initialHour = moment(selectInfo.startStr).format('HH:mm')
    const finalHour = moment(selectInfo.endStr).format('HH:mm')
    const initialDate = selectInfo.startStr
    const finalDate = selectInfo.endStr

    const data: CalendarDate = {
      initial_hour: initialHour,
      final_hour: finalHour,
      initial_date: initialDate,
      final_date: finalDate
    }

    this.openDialogTask(false, null, false, data, false, false, false)

  }

  /**
   * Click Event Edit and View Detail for status
   * @param clickInfo
   */
  handleEventClick(clickInfo: EventClickArg) {

    this.taskService.getTaskById(Number(clickInfo.event.id)).subscribe(res => {
      if (res.data.status === 'Programado') {
        this.openDialogTask(true, Number(clickInfo.event.id), false, null, false, false, false)
      }
      if (res.data.status === 'Finalizado' || res.data.status === 'En Proceso') {
        this.openDialogTask(false, Number(clickInfo.event.id), true, null, false, false, true)
      }
    })

  }

  /**
   * Event for match Model Event Api and Api Custom
   * @param events
   */
  handleEvents(events: EventApi[]) {
    this.tasks = events;
  }

  /**
   * Open dialog for add and update task.
   * @param edit
   * @param idTask
   * @param info
   * @param calendar
   * @param eventDrag
   * @param multiple
   * @param editCustom
   */
  openDialogTask(edit: boolean,
                 idTask: number | null,
                 info: boolean,
                 calendar: CalendarDate | null,
                 eventDrag: boolean,
                 multiple: boolean,
                 editCustom: boolean): void {
    const dialogRef = this.dialog.open(CrudComponent, {
      autoFocus: false,
      disableClose: true,
      width: '250vw',
      data: {edit: edit, idTask: idTask, info: info, calendar, eventDrag: eventDrag, multiple: multiple, editCustom: editCustom}
    });
    dialogRef.afterClosed().subscribe(res => {
      this.tasks = []
      this.initTaskCalendar()
      this.getTasksPaginator(this.paginator);
    });
  }

  /**
   * Filter Customer and Search
   */
  filterSelectCustomer(idCustomer: number){
    this.taskService.getTasks(idCustomer, '', '', '').subscribe(res => {
      this.idCustomer = idCustomer
      this.tasks = []
      this.initTaskCalendar()
    })
    this.taskService.getTasksPaginate(this.taskPaginateForm.value, this.calendarForm.value).subscribe(res => {
      this.getTasksPaginator(this.paginator);
    })
  }

  /**
   * Filter By Employee in Task
   * @param idEmployee
   */
  filterSelectEmployee(idEmployee: number){
    this.taskService.getTasks('', idEmployee, '', '').subscribe(res => {
      this.idEmployee = idEmployee
      this.tasks = []
      this.initTaskCalendar()
    })
    this.taskService.getTasksPaginate(this.taskPaginateForm.value, this.calendarForm.value).subscribe(res => {
      this.getTasksPaginator(this.paginator);
    })
  }

  /**
   * Filter By Group in Task
   * @param idJobCenter
   */
  filterSelectJobCenter(idJobCenter: number){
    this.taskService.getTasks('', '', idJobCenter,'').subscribe(res => {
      this.idJobCenter = idJobCenter
      this.tasks = []
      this.initTaskCalendar()
    })
    this.taskService.getTasksPaginate(this.taskPaginateForm.value, this.calendarForm.value).subscribe(res => {
      this.getTasksPaginator(this.paginator);
    })
  }

  /**
   * Filter By Status in Task
   * @param status
   */
  filterSelectStatus(status: number){
    this.taskService.getTasks('', '', '', status).subscribe(res => {
      this.status = status
      this.tasks = []
      this.initTaskCalendar()
    })
    this.taskService.getTasksPaginate(this.taskPaginateForm.value, this.calendarForm.value).subscribe(res => {
      this.getTasksPaginator(this.paginator);
    })
  }

  /**
   * Services Shared for update any Component
   */
  updateEventSharedService(){
    this.sharedService.changeEvent.subscribe(change => {
      this.tasks = []
      // Valuers Initials Calendar
      this.initCalendar()
      // Events From Api
      this.initTaskCalendar()
      this.getTasksPaginator(this.paginator)
    })
  }

  /**
   * load Form Reactive Form
   */
  loadCalendarForm() : void {
    this.calendarForm = this.formBuilder.group({
      initial_date: [{value: '', disabled:false}, Validators.required],
      final_date: [{value: '', disabled:false}, Validators.required],
      customer: [{value: '', disabled:false},],
      employee: [{value: '', disabled:false},],
      job_center: [{value: '', disabled:false},],
      work_type: [{value: '', disabled:false},],
      status : [{value: '', disabled:false},]
    });
  }

  /**
   * Array from service for Customers
   */
  loadDataCustomers(){
    this.taskService.getCustomers().subscribe(customers => {this.customers = customers.data} )
  }

  /**
   * Array from service for Groups
   */
  loadDataGroups(){
    this.taskService.getJobCenters().subscribe(jobCenters => {this.jobCenters = jobCenters.data} )
  }

  /**
   * Array from service for Employees
   */
  loadDataEmployees(){
    this.taskService.getEmployees().subscribe(employees => {this.employees = employees.data} )
  }

  /**
   * Array from service for Employees
   */
  loadDataWorkTypes(){
    this.taskService.getWorkTypes().subscribe(workTypes => {this.workTypes = workTypes.data} )
  }

  /**
   * Export Excel and Pdf with filters
   * @param type
   */
  downloadReport(type: string){
    this.validateForm()
    this.spinner.show()
    this.taskService.exportReportTask(this.calendarForm.value, type).subscribe(res => {
        let file : any;
        if (type === 'excel') file = this.sharedService.createBlobToExcel(res);
        else file = this.sharedService.createBlobToPdf(res);

        let date_initial = this.dateService.getFormatDataDate(this.calendarForm.value.initial_date)
        let final_date = this.dateService.getFormatDataDate(this.calendarForm.value.final_date)

        fileSaver.saveAs(file, `Reporte-Tareas-${date_initial}-${final_date}`);

        this.spinner.hide()
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      })
    )
  }

  /**
   * Export Pdf Summary
   */
  reportTaskPdf(){
    this.validateForm()
    this.spinner.show()
    this.taskService.reportTaskPdf(this.calendarForm.value).subscribe(res => {
        let file = this.sharedService.createBlobToPdf(res);
        let date_initial = this.dateService.getFormatDataDate(this.calendarForm.value.initial_date)
        let final_date = this.dateService.getFormatDataDate(this.calendarForm.value.final_date)

        fileSaver.saveAs(file, `Reporte-General-Tareas-${date_initial}-${final_date}`);

        this.spinner.hide()
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      })
    )
  }

  /**
   * Export Pdf Calendar
   */
  reportCalendarPdf(){
    this.validateForm()
    this.spinner.show()
    this.taskService.reportCalendarPdf(this.calendarForm.value).subscribe(res => {
        let file = this.sharedService.createBlobToPdf(res);
        let date_initial = this.dateService.getFormatDataDate(this.calendarForm.value.initial_date)
        let final_date = this.dateService.getFormatDataDate(this.calendarForm.value.final_date)

        fileSaver.saveAs(file, `Reporte-Calendario-Tareas-${date_initial}-${final_date}`);

        this.spinner.hide()
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      })
    )
  }

  /**
   * Export Pdf Services Finalized
   */
  reportFinalizedPdf(){
    this.validateForm()
    this.spinner.show()
    this.taskService.reportServiceFinalizedPdf(this.calendarForm.value).subscribe(res => {
        let file = this.sharedService.createBlobToPdf(res);
        let date_initial = this.dateService.getFormatDataDate(this.calendarForm.value.initial_date)
        let final_date = this.dateService.getFormatDataDate(this.calendarForm.value.final_date)

        fileSaver.saveAs(file, `Reporte-Servicios-Finalizados-${date_initial}-${final_date}`);

        this.spinner.hide()
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      })
    )
  }

  /**
   * Export Excel Services Finalized
   */
  reportFinalizedExcel(){
    this.validateForm()
    this.spinner.show()
    this.taskService.reportServiceFinalizedExcel(this.calendarForm.value).subscribe(res => {
        let file = this.sharedService.createBlobToExcel(res);
        let date_initial = this.dateService.getFormatDataDate(this.calendarForm.value.initial_date)
        let final_date = this.dateService.getFormatDataDate(this.calendarForm.value.final_date)

        fileSaver.saveAs(file, `Reporte-Servicios-Finalizados-${date_initial}-${final_date}`);

        this.spinner.hide()
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      })
    )
  }


  /**
   * Update Invoiced Table and Calendar
   * @param event
   * @param id
   */
  changeInvoice(event: any, id: number) {

    this.spinner.show()
    this.taskService.updateInvoice(event, id).subscribe(res => {
        this.sharedService.showSnackBar(res.message);
        this.tasks = []
        this.initTaskCalendar()
        this.getTasksPaginator(this.paginator);
        this.spinner.hide()
      }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
      })
    )
  }

  /**
   * Validate form in general
   */
  validateForm(){
    this.submit = true;
    if(this.calendarForm.invalid){
      this.sharedService.showSnackBar('Los campos con * son obligatorios.');
      return
    }
  }

  /**
   * Validations
   * @param field
   */
  fieldInvalid(field: string) {
    return this.calendarForm.get(field)?.invalid && this.calendarForm.get(field)?.touched
  }

  getTasksPaginator(event: any) {
    const paginator: MatPaginator = event;
    this.taskPaginateForm.get('page')?.setValue(paginator.pageIndex + 1);
    this.spinner.show()
    this.taskService.getTasksPaginate(this.taskPaginateForm.value, this.calendarForm.value)
      .subscribe(
        (tasks: ModelTask) => {
          this.spinner.hide()
          this.dataSource.data = tasks.data
          this.totalItems = tasks.meta.total;
        },
        (error => {
          this.spinner.hide()
          this.sharedService.errorDialog(error)
        })
      )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Update a task.
   */
  updateTask(task: Task): void {

    let data: CalendarDate = {
      initial_hour: task.initial_hour,
      final_hour: task.final_hour,
      initial_date: task.initial_date,
      final_date: task.final_date
    }
    let isEdit, isEditCustom : boolean;
    isEditCustom = task.status !== 'Programado';
    isEdit = !(task.status === 'Finalizado' || task.status === 'En Proceso');
    this.openDialogTask(isEdit, Number(task.id), isEditCustom, data, false, false, isEditCustom)
  }

  /**
   * delete a task.
   */
  deleteTask(task: Task): void {
    // Show Dialog
    const dialog = this.dialog.open(ConfirmComponent, {
      width: '250',
      data: task
    })

    dialog.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.spinner.show()
          this.taskService.deleteTask(Number(task.id)).subscribe(response => {
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
   * Open dialog for add and update group.
   * @param edit
   * @param idContract
   * @param info
   */
  openDialogContract(edit: boolean, idContract: number | null, info: boolean): void {
    const dialogRef = this.dialog.open(CrudComponent, {
      autoFocus: false,
      disableClose: true,
      width: '50vw',
      data: {edit: edit, idContract: idContract, info: info}
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === ModalResponse.UPDATE) {
        this.getTasksPaginator(this.paginator);
      }
    });
  }

  /* Método que permite iniciar los filtros de rutas*/
  loadTaskFilterForm(): void {
    this.taskPaginateForm = this.formBuilder.group({
      page: [],
      page_size: this.pageSize
    })
  }

}
