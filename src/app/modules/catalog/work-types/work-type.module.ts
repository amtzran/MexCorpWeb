import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkTypeRoutingModule } from './work-type-routing.module';
import {WorkTypeComponent} from "./work-type.component";
import {MaterialModule} from "../../../material/material.module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {ReactiveFormsModule} from "@angular/forms";
import { TableComponent } from './components/table/table.component';
import { CrudComponent } from './components/crud/crud.component';


@NgModule({
  declarations: [
    WorkTypeComponent,
    TableComponent,
    CrudComponent,
  ],
  imports: [
    CommonModule,
    WorkTypeRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule
  ]
})
export class WorkTypeModule { }
