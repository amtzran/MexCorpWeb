import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttendanceRoutingModule } from './attendance-routing.module';
import { AttendanceComponent } from './attendance.component';
import { TableComponent } from './components/table/table.component';
import { CrudComponent } from './components/crud/crud.component';
import {MaterialModule} from "../../material/material.module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {ReactiveFormsModule} from "@angular/forms";
import {NgxSpinnerModule} from "ngx-spinner";
import {NgSelectModule} from "@ng-select/ng-select";
import { ExtrasComponent } from './components/extras/extras.component';
import { AttendanceTabComponent } from './components/attendance-tab/attendance-tab.component';


@NgModule({
  declarations: [
    AttendanceComponent,
    TableComponent,
    CrudComponent,
    ExtrasComponent,
    AttendanceTabComponent
  ],
  imports: [
    CommonModule,
    AttendanceRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    NgSelectModule,
  ]
})
export class AttendanceModule { }
