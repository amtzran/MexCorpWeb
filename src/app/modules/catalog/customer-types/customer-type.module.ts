import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerTypeRoutingModule } from './customer-type-routing.module';
import { CustomerTypeComponent } from './customer-type.component';
import { CrudComponent } from './components/crud/crud.component';
import { TableComponent } from './components/table/table.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import {MaterialModule} from "../../../material/material.module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    CustomerTypeComponent,
    CrudComponent,
    TableComponent,
    ConfirmComponent
  ],
  imports: [
    CommonModule,
    CustomerTypeRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule
  ]
})
export class CustomerTypeModule { }
