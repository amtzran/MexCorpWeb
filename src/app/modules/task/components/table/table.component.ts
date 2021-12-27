import { Component, OnInit } from '@angular/core';
import {CalendarOptions, DateSelectArg, EventApi, EventClickArg} from "@fullcalendar/angular";
import {CalendarDate, Event, Task} from "../../models/task.interface";
import {TaskService} from "../../services/task.service";
import {MatDialog} from "@angular/material/dialog";
import * as moment from "moment";
import {CrudComponent} from "../crud/crud.component";
import {ModalResponse} from "../../../../core/utils/ModalResponse";
import {EventDropArg} from "@fullcalendar/core";
import {ConfirmComponent} from "../../../../shared/components/confirm/confirm.component";
import {ConfirmEditComponent} from "../confirm-edit/confirm-edit.component";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./app.component.scss']
  /*styles: [``
  ]*/
})
export class TableComponent implements OnInit {

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
      //timeZone: 'local',
      locale: 'es',
      //eventsSet: this.handleEvents.bind(this)
      eventDrop: this.handleEventDrag.bind(this)
      //eventColor: '#378006'
    };
  }

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
      })

  }

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

  handleEvents(events: Event[]) {
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
        //TODO: Add calendar Dynamic
        //this.initTaskCalendar()
        location.reload()
      }
    });
  }

}
