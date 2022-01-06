import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { ListComponent } from './pages/list/list.component';
import { MaterialModule } from "../../../material/material.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ReactiveFormsModule } from "@angular/forms";
import { CrudComponent } from './components/crud/crud.component';
import {NgxSpinnerModule} from "ngx-spinner";


@NgModule({
  declarations: [
    HomeComponent,
    ListComponent,
    CrudComponent
  ],
    imports: [
        CommonModule,
        CustomerRoutingModule,
        MaterialModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        NgxSpinnerModule
    ]
})
export class CustomerModule { }
