import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerTypeRoutingModule } from './customer-type-routing.module';
import { CustomerTypeComponent } from './customer-type.component';
import { CrudComponent } from './components/crud/crud.component';
import { TableComponent } from './components/table/table.component';


@NgModule({
  declarations: [
    CustomerTypeComponent,
    CrudComponent,
    TableComponent
  ],
  imports: [
    CommonModule,
    CustomerTypeRoutingModule
  ]
})
export class CustomerTypeModule { }
