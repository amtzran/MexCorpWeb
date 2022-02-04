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
import {NgxSpinnerModule} from "ngx-spinner";
import {NgSelectModule} from "@ng-select/ng-select";
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';


@NgModule({
  declarations: [
    HomeComponent,
    ListComponent,
    CrudComponent,
    EmployeeComponent,
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    NgSelectModule,
  ]
})
export class EmployeeModule { }
