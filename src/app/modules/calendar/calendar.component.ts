import { Component, OnInit } from '@angular/core';
import {CalendarOptions, DateSelectArg, EventApi, EventClickArg} from "@fullcalendar/angular";
import {TaskService} from "../task/services/task.service";
import {Event, Task} from "../task/models/task.interface";
import {CrudComponent} from "../task/components/crud/crud.component";
import {MatDialog} from "@angular/material/dialog";
import {ModalResponse} from "../../core/utils/ModalResponse";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
})
export class CalendarComponent implements OnInit {

  tasks: Event[] = []
  calendarOptions!: CalendarOptions

  constructor( private taskService: TaskService,
               private dialog: MatDialog) { }

  ngOnInit(): void {
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
      initialView: 'timeGridWeek',
      events: this.tasks,
      weekends: true,
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      select: this.handleDateSelect.bind(this),
      eventClick: this.handleEventClick.bind(this),
      //eventsSet: this.handleEvents.bind(this)
    };
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    //this.tasks = events;
  }

  test(){
    this.taskService.getTasks()
      .subscribe(tasks => {
        this.tasks = []
        tasks.forEach(element => {
          this.tasks.push({
            id: String(element.id),
            title: element.title,
            start:`${element.initial_date} ${element.initial_hour}`,
            end: `${element.final_date} ${element.final_hour}`
          })
        })
        this.initCalendar()
      })
  }

  /**
   * Open dialog for add and update group.
   * @param edit
   * @param idTask
   * @param info
   */
  openDialogCustomer(edit: boolean, idTask: number | null, info: boolean): void {
    const dialogRef = this.dialog.open(CrudComponent, {
      autoFocus: false,
      disableClose: true,
      width: '75vw',
      data: {edit: edit, idTask: idTask, info: info}
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === ModalResponse.UPDATE) {
        //this.getCustomersPaginator(this.paginator);
      }
    });
  }

}
