import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import {HomeComponent} from "../home/home.component";
import {CustomerComponent} from "../customer/customer.component";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../../shared/components/shared.module";


@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent,
    CustomerComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    RouterModule,
    SharedModule
  ]
})
export class DashboardModule { }
