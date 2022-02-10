import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TaskRoutingModule} from './task-routing.module';
import {FullCalendarModule} from "@fullcalendar/angular";
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction'
import {TaskComponent} from './task.component';
import {TableComponent} from './components/table/table.component';
import {CrudComponent} from './components/crud/crud.component';
import {FlexLayoutModule} from "@angular/flex-layout";
import {ReactiveFormsModule} from "@angular/forms";
import {MaterialModule} from "../../material/material.module";
import {ConfirmEditComponent} from './components/confirm-edit/confirm-edit.component';
import {NgxSpinnerModule} from "ngx-spinner";
import {NgxMultipleDatesModule} from "ngx-multiple-dates";
import {NgSelectModule} from "@ng-select/ng-select";
import { SendEmailComponent } from './components/send-email/send-email.component';
import { ImageDetailComponent } from './components/image-detail/image-detail.component';

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  timeGridPlugin,
  listPlugin,
  interactionPlugin
]);

@NgModule({
  declarations: [
    TaskComponent,
    TableComponent,
    CrudComponent,
    ConfirmEditComponent,
    SendEmailComponent,
    ImageDetailComponent
  ],
  imports: [
    CommonModule,
    TaskRoutingModule,
    FullCalendarModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    NgxMultipleDatesModule,
    NgSelectModule,
  ]
})
export class TaskModule {
}
