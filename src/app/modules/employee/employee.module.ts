import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { ListComponent } from './pages/list/list.component';
import { MaterialModule} from "../../material/material.module";
import { FlexLayoutModule} from "@angular/flex-layout";
import { ReactiveFormsModule} from "@angular/forms";
import { CrudComponent } from './components/crud/crud.component';
import { EmployeeComponent } from './employee.component';


@NgModule({
  declarations: [
    HomeComponent,
    ListComponent,
    CrudComponent,
    EmployeeComponent
  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule
  ]
})
export class EmployeeModule { }
