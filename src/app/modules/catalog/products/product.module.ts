import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { TableComponent } from './components/table/table.component';
import { CrudComponent } from './components/crud/crud.component';
import {MaterialModule} from "../../../material/material.module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {ReactiveFormsModule} from "@angular/forms";
import {NgxSpinnerModule} from "ngx-spinner";
import {ProductComponent} from "./product.component";
import {NgSelectModule} from "@ng-select/ng-select";


@NgModule({
  declarations: [
    ProductComponent,
    TableComponent,
    CrudComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    NgSelectModule
  ]
})
export class ProductModule { }
