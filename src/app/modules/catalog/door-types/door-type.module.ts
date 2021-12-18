import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DoorTypeRoutingModule } from './door-type-routing.module';
import { DoorTypeComponent } from './door-type.component';
import { CrudComponent } from './components/crud/crud.component';
import { TableComponent } from './components/table/table.component';


@NgModule({
  declarations: [
    DoorTypeComponent,
    CrudComponent,
    TableComponent
  ],
  imports: [
    CommonModule,
    DoorTypeRoutingModule
  ]
})
export class DoorTypeModule { }
