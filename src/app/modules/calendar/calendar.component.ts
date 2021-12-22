import { Component, OnInit } from '@angular/core';
import {CalendarOptions, DateSelectArg, EventApi, EventClickArg} from "@fullcalendar/angular";
import {TaskService} from "../task/services/task.service";
import {CalendarDate, Event, Task} from "../task/models/task.interface";
import {CrudComponent} from "../task/components/crud/crud.component";
import {MatDialog} from "@angular/material/dialog";
import {ModalResponse} from "../../core/utils/ModalResponse";
import * as moment from "moment"

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
})
export class CalendarComponent implements OnInit {

  tasks: Event[] = []
  calendarOptions!: CalendarOptions

  constructor( private taskService: TaskService,
               private dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.initTaskCalendar()
  }

  initTaskCalendar(): void {
    this.taskService.getTasks()
      .subscribe(tasks => {

        tasks.forEach(element => {
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

  initCalendar() {
    this.calendarOptions = {
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      },
      initialView: 'dayGridWeek',
      events: this.tasks,
      weekends: true,
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      select: this.handleDateSelect.bind(this),
      eventClick: this.handleEventClick.bind(this),
      timeZone: 'local',
      locale: 'es',
      //eventsSet: this.handleEvents.bind(this)
    };
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    //const title = prompt('Please enter a new title for your event');
    //const calendarApi = selectInfo.view.calendar;
    const initialHour = moment(selectInfo.startStr).format('HH:mm')
    const finalHour = moment(selectInfo.endStr).format('HH:mm')
    const initialDate = moment(selectInfo.startStr).format('YYYY-MM-DD')
    const finalDate = moment(selectInfo.endStr).format('YYYY-MM-DD')

    const data: CalendarDate = {
      initial_hour : initialHour,
      final_hour : finalHour,
      initial_date : initialDate,
      final_date : finalDate
    }

    this.openDialogTask(false, null, false, data)
  }

  handleEventClick(clickInfo: EventClickArg) {

    this.taskService.getTaskById(Number(clickInfo.event.id)).subscribe(res => {
      if (res.status === 1) {
        this.openDialogTask(true, Number(clickInfo.event.id), false, null)
      }
      else {
        this.openDialogTask(false, Number(clickInfo.event.id), true, null)
      }
    })

  }

  handleEvents(events: EventApi[]) {
    //this.tasks = events;
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
        //TODO: Add calendar Dinamic
        //this.initTaskCalendar()
        location.reload()
      }
    });
  }

}
