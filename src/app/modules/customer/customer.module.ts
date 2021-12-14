import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { ListComponent } from './pages/list/list.component';
import { MaterialModule } from "../../material/material.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { AddComponent } from './pages/add/add.component';
import { ReactiveFormsModule } from "@angular/forms";
import { ConfirmComponent } from './components/confirm/confirm.component';


@NgModule({
  declarations: [
    HomeComponent,
    ListComponent,
    AddComponent,
    ConfirmComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule
  ]
})
export class CustomerModule { }
