import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DoorTypeRoutingModule } from './door-type-routing.module';
import { DoorTypeComponent } from './door-type.component';
import { CrudComponent } from './components/crud/crud.component';
import { TableComponent } from './components/table/table.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import {MaterialModule} from "../../../material/material.module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    DoorTypeComponent,
    CrudComponent,
    TableComponent,
    ConfirmComponent
  ],
  imports: [
    CommonModule,
    DoorTypeRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule
  ]
})
export class DoorTypeModule { }
