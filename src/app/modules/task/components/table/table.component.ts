import {Component, ElementRef, forwardRef, OnInit, ViewChild} from '@angular/core';
import {Calendar, CalendarOptions, DateSelectArg, EventClickArg, FullCalendarComponent} from "@fullcalendar/angular";
import {CalendarDate} from "../../models/task.interface";
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
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./app.component.scss']
  /*styles: [``]*/
})
export class TableComponent implements OnInit {
  // Declare any for model EventApi
  tasks: any = []
  calendarOptions!: CalendarOptions
  // references the #calendar in the template
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  @ViewChild('external') external!: ElementRef;

  customers: Customer[] = [];
  jobCenters: JobCenter[] = [];
  employees: Employee[] = [];
  idCustomer : number | string = '';
  idEmployee : number | string = '';
  idJobCenter : number | string = '';
  status : number | string = '';
  changeEvent : boolean = true;
  calendarForm!: FormGroup;

  /**
   * Values Initials Calendar
   */
  headerToolbar = {
    left: 'prev,next,today,changeRange',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek,listDay'
  }

  /**
   * Values in Spanish Buttons
   */
  buttonText = {
    today: 'Hoy',
    month: 'Mes',
    week: 'Semana',
    day: 'Día',
    list: 'Lista'
  }

  //This Values Ranges Date
  modeFull = true;

  constructor(private taskService: TaskService,
              private dialog: MatDialog,
              private spinner: NgxSpinnerService,
              private sharedService: SharedService,
              private formBuilder : FormBuilder) {}

  ngOnInit(): void {
    // Selects
    this.loadCalendarGroup()
    // Type Customers
    this.loadDataCustomers()
    // Type Groups
    this.taskService.getJobCenters().subscribe(jobCenters => {this.jobCenters = jobCenters.data} )

    // Type Employees
    this.taskService.getEmployees().subscribe(employees => {this.employees = employees.data} )

    forwardRef(() => Calendar)
    // Valuers Initials Calendar
    this.initCalendar()
    // Events From Api
    this.initTaskCalendar()

    //Update Main Component
    this.updateEventSharedService()
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
              title: element.title,
              start: `${element.initial_date} ${element.initial_hour}`,
              end: `${element.final_date} ${element.final_hour}`,
              backgroundColor: color,
              borderColor: color
            })
        })
        this.initCalendar()
        }, (error => {
          this.spinner.hide()
          this.sharedService.errorDialog()
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

    this.openDialogTask(true, Number(selectInfoEventDrag.event.id), false, data, true)

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

    this.openDialogTask(false, null, false, data, false)

  }

  /**
   * Click Event Edit and View Detail for status
   * @param clickInfo
   */
  handleEventClick(clickInfo: EventClickArg) {

    this.taskService.getTaskById(Number(clickInfo.event.id)).subscribe(res => {
      if (res.data.status === 'Programado') {
        this.openDialogTask(true, Number(clickInfo.event.id), false, null, false)
      }
      if (res.data.status === 'Finalizado' || res.data.status === 'En Proceso') {
        this.openDialogTask(false, Number(clickInfo.event.id), true, null, false)
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
   */
  openDialogTask(edit: boolean, idTask: number | null, info: boolean, calendar: CalendarDate | null, eventDrag: boolean): void {
    const dialogRef = this.dialog.open(CrudComponent, {
      autoFocus: false,
      disableClose: true,
      width: '250vw',
      data: {edit: edit, idTask: idTask, info: info, calendar, eventDrag: eventDrag}
    });
    dialogRef.afterClosed().subscribe(res => {
      this.tasks = []
      this.initTaskCalendar()
    });
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
    })
  }

  /**
   * Filter Customer and Search
   * @param customer
   */
  setCustomer(customer: Customer){
    this.taskService.getTasks(String(customer), '', '', '').subscribe(res => {
      this.idCustomer = String(customer)
      this.tasks = []
      this.initTaskCalendar()
    })
  }

  /**
   * Load Form
   */
  loadCalendarGroup() {
    this.calendarForm = this.formBuilder.group({
      'customer' : ['']
    })
  }

  /**
   * Array from service for Customers
   */
  loadDataCustomers(){
    this.taskService.getCustomers().subscribe(customers => {
      this.customers = customers.data
    } )
  }

}
