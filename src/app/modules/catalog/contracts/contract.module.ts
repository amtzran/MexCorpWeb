import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractRoutingModule } from './contract-routing.module';
import {ContractComponent} from "./contract.component";
import { TableComponent } from './components/table/table.component';
import { CrudComponent } from './components/crud/crud.component';
import {MaterialModule} from "../../../material/material.module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {ReactiveFormsModule} from "@angular/forms";
import {NgxSpinnerModule} from "ngx-spinner";


@NgModule({
  declarations: [
    ContractComponent,
    TableComponent,
    CrudComponent,
  ],
    imports: [
        CommonModule,
        ContractRoutingModule,
        MaterialModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        NgxSpinnerModule
    ]
})
export class ContractModule { }
