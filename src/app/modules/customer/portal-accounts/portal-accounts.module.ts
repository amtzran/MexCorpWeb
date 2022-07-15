import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortalAccountsRoutingModule } from './portal-accounts-routing.module';
import {MaterialModule} from "../../../material/material.module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {ReactiveFormsModule} from "@angular/forms";
import {NgxSpinnerModule} from "ngx-spinner";
import {NgSelectModule} from "@ng-select/ng-select";
import { CrudComponent } from './components/crud/crud.component';
import {PortalAccountsComponent} from "./portal-accounts.component";


@NgModule({
  declarations: [
    CrudComponent,
    PortalAccountsComponent
  ],
  imports: [
    CommonModule,
    PortalAccountsRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    NgSelectModule
  ]
})
export class PortalAccountsModule { }
