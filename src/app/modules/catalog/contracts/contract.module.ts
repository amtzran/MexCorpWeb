import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractRoutingModule } from './contract-routing.module';
import {ContractComponent} from "./contract.component";
import { TableComponent } from './components/table/table.component';
import { CrudComponent } from './components/crud/crud.component';
import {MaterialModule} from "../../../material/material.module";
import {FlexLayoutModule} from "@angular/flex-layout";
import { ConfirmComponent } from './components/confirm/confirm.component';
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    ContractComponent,
    TableComponent,
    CrudComponent,
    ConfirmComponent
  ],
  imports: [
    CommonModule,
    ContractRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule
  ]
})
export class ContractModule { }
