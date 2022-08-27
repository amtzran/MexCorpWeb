import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TurnRoutingModule } from './turn-routing.module';
import { TableComponent } from './components/table/table.component';
import { AddUpdateComponent } from './components/add-update/add-update.component';
import {MaterialModule} from "../../../material/material.module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {ReactiveFormsModule} from "@angular/forms";
import {NgxSpinnerModule} from "ngx-spinner";
import {NgSelectModule} from "@ng-select/ng-select";
import {TurnComponent} from "./turn.component";


@NgModule({
  declarations: [
    TurnComponent,
    TableComponent,
    AddUpdateComponent
  ],
  imports: [
    CommonModule,
    TurnRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    NgSelectModule
  ]
})
export class TurnModule { }
