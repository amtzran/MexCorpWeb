import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobTitleRoutingModule } from './job-title-routing.module';
import { JobTitleComponent } from './job-title.component';
import { CrudComponent } from './components/crud/crud.component';
import { TableComponent } from './components/table/table.component';
import {MaterialModule} from "../../../material/material.module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {ReactiveFormsModule} from "@angular/forms";
import {NgxSpinnerModule} from "ngx-spinner";


@NgModule({
  declarations: [
    JobTitleComponent,
    CrudComponent,
    TableComponent,
  ],
    imports: [
        CommonModule,
        JobTitleRoutingModule,
        MaterialModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        NgxSpinnerModule
    ]
})
export class JobTitleModule { }
