import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryComponent } from './inventory.component';
import { CrudComponent } from './components/crud/crud.component';
import {MaterialModule} from "../../material/material.module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {ReactiveFormsModule} from "@angular/forms";
import {NgxSpinnerModule} from "ngx-spinner";
import {NgSelectModule} from "@ng-select/ng-select";
import {TableComponent} from "./components/table/table.component";
import { EntryComponent } from './components/tabs/entry/entry.component';
import { StockComponent } from './components/tabs/stock/stock.component';
import { MovementComponent } from './components/tabs/movement/movement.component';
import { OutputComponent } from './components/tabs/output/output.component';
import { CrudOutputComponent } from './components/crud-output/crud-output.component';


@NgModule({
  declarations: [
    InventoryComponent,
    TableComponent,
    CrudComponent,
    EntryComponent,
    StockComponent,
    MovementComponent,
    OutputComponent,
    CrudOutputComponent
  ],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    NgSelectModule,
  ]
})
export class InventoryModule { }
