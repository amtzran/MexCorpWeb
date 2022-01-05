import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerTypeRoutingModule } from './customer-type-routing.module';
import { CustomerTypeComponent } from './customer-type.component';
import { CrudComponent } from './components/crud/crud.component';
import { TableComponent } from './components/table/table.component';
import {MaterialModule} from "../../../material/material.module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {ReactiveFormsModule} from "@angular/forms";
import {NgxSpinnerModule} from "ngx-spinner";


@NgModule({
  declarations: [
    CustomerTypeComponent,
    CrudComponent,
    TableComponent,
  ],
    imports: [
        CommonModule,
        CustomerTypeRoutingModule,
        MaterialModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        NgxSpinnerModule
    ]
})
export class CustomerTypeModule { }
