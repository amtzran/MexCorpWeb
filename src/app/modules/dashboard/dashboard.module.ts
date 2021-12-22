import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import {HomeComponent} from "../home/home.component";
import {CustomerComponent} from "../customer/customer.component";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../../shared/components/shared.module";
import {ConfirmComponent} from "../../shared/components/confirm/confirm.component";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MaterialModule} from "../../material/material.module";


@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent,
    CustomerComponent,
    ConfirmComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    RouterModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule
  ]
})
export class DashboardModule { }
