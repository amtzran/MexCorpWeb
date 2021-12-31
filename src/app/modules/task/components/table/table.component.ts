import {Component, ElementRef, forwardRef, OnInit, ViewChild} from '@angular/core';
import {Calendar, CalendarOptions, DateSelectArg, EventClickArg, FullCalendarComponent } from "@fullcalendar/angular";
import {CalendarDate} from "../../models/task.interface";
import {TaskService} from "../../services/task.service";
import {MatDialog} from "@angular/material/dialog";
import * as moment from "moment";
import {CrudComponent} from "../crud/crud.component";
import {ModalResponse} from "../../../../core/utils/ModalResponse";
import {EventApi, EventDropArg} from "@fullcalendar/core";
import {ConfirmEditComponent} from "../confirm-edit/confirm-edit.component";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

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

  constructor( private taskService: TaskService,
               private dialog: MatDialog) {}

  ngOnInit(): void {
    forwardRef(() => Calendar)
    // Valuers Initials Calendar
    this.initCalendar()
    // Events From Api
    this.initTaskCalendar()
  }

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
    today:    'Hoy',
    month:    'Mes',
    week:     'Semana',
    day:      'Día',
    list:     'Lista'
  }

  //This Values Ranges Date
  modeFull = false;

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
      customButtons: {
        changeRange: {
          text: '12/24',
          click: this.customFunction.bind(this)
        }
      },
      //slotMinTime: '00:00:00',
      //eventColor: '#378006'
    };
  }

  customFunction(){
    if (this.modeFull) {
      this.calendarOptions.slotMinTime = '00:00:00';
      this.calendarOptions.slotMaxTime = '24:00:00';
      this.modeFull = false
    }
    else {
      this.calendarOptions.slotMinTime = '08:00:00';
      this.calendarOptions.slotMaxTime = '20:00:00';
      this.modeFull = true
    }
  }

  /**
   * Service for tasks in Calendar
   */
  initTaskCalendar(): void {
    this.taskService.getTasks()
      .subscribe(tasks => {
        tasks.data.forEach(element => {
          this.tasks.push({
            id: String(element.id),
            title: element.title,
            start:`${element.initial_date} ${element.initial_hour}` ,
            end: `${element.final_date} ${element.final_hour}`
          })
        })
        this.initCalendar()
      })
  }


  /**
   * Update Calendar Date And Hour event dragging
   * @param selectInfoEventDrag
   */
  handleEventDrag(selectInfoEventDrag: EventDropArg) {

    // Show Dialog
    const dialog = this.dialog.open(ConfirmEditComponent, {
      width: '250',
      data: selectInfoEventDrag.event
    })

    dialog.afterClosed().subscribe(
      ( result ) => {
        if ( result ) {

          const initialHour = moment(selectInfoEventDrag.event.startStr).format('HH:mm')
          const finalHour = moment(selectInfoEventDrag.event.endStr).format('HH:mm')
          const initialDate = selectInfoEventDrag.event.startStr
          const finalDate = selectInfoEventDrag.event.endStr

          const data: CalendarDate = {
            initial_hour : initialHour,
            final_hour : finalHour,
            initial_date : initialDate,
            final_date : finalDate
          }

          this.taskService.patchTaskDateAndHour(Number(selectInfoEventDrag.event.id), data).subscribe(res => {
            console.log(res)
            console.log('Correctamente')
          })
        }

        else selectInfoEventDrag.revert()

      })

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
      initial_hour : initialHour,
      final_hour : finalHour,
      initial_date : initialDate,
      final_date : finalDate
    }

    this.openDialogTask(false, null, false, data)
  }

  /**
   * Click Event Edit and View Detail for status
   * @param clickInfo
   */
  handleEventClick(clickInfo: EventClickArg) {

    this.taskService.getTaskById(Number(clickInfo.event.id)).subscribe(res => {
      if (res.data.status === 'Programado') {
        this.openDialogTask(true, Number(clickInfo.event.id), false, null)
      }
      else {
        this.openDialogTask(false, Number(clickInfo.event.id), true, null)
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
   */
  openDialogTask(edit: boolean, idTask: number | null, info: boolean, calendar: CalendarDate | null): void {
    const dialogRef = this.dialog.open(CrudComponent, {
      autoFocus: false,
      disableClose: true,
      width: '50vw',
      data: {edit: edit, idTask: idTask, info: info, calendar}
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === ModalResponse.UPDATE) {
        this.tasks = []
        this.initTaskCalendar()
      }
    });
  }

}
