import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobTitleRoutingModule } from './job-title-routing.module';
import { JobTitleComponent } from './job-title.component';
import { CrudComponent } from './components/crud/crud.component';
import { TableComponent } from './components/table/table.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import {MaterialModule} from "../../../material/material.module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    JobTitleComponent,
    CrudComponent,
    TableComponent,
    ConfirmComponent
  ],
  imports: [
    CommonModule,
    JobTitleRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule
  ]
})
export class JobTitleModule { }
