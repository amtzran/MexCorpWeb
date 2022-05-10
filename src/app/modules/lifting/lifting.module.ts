import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LiftingRoutingModule } from './lifting-routing.module';
import { LiftingComponent } from './lifting.component';
import { TableComponent } from './components/table/table.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MaterialModule} from "../../material/material.module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {NgxSpinnerModule} from "ngx-spinner";


@NgModule({
  declarations: [
    LiftingComponent,
    TableComponent
  ],
  imports: [
    CommonModule,
    LiftingRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
  ]
})
export class LiftingModule { }
