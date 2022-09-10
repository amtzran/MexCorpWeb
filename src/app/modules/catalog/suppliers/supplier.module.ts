import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupplierRoutingModule } from './supplier-routing.module';
import { SupplierComponent } from './supplier.component';
import { TableComponent } from './components/table/table.component';
import { CrudComponent } from './components/crud/crud.component';
import {MaterialModule} from "../../../material/material.module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {ReactiveFormsModule} from "@angular/forms";
import {NgxSpinnerModule} from "ngx-spinner";


@NgModule({
  declarations: [
    SupplierComponent,
    TableComponent,
    CrudComponent
  ],
  imports: [
    CommonModule,
    SupplierRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ]
})
export class SupplierModule { }
