import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobTitleRoutingModule } from './job-title-routing.module';
import { JobTitleComponent } from './job-title.component';
import { CrudComponent } from './components/crud/crud.component';
import { TableComponent } from './components/table/table.component';


@NgModule({
  declarations: [
    JobTitleComponent,
    CrudComponent,
    TableComponent
  ],
  imports: [
    CommonModule,
    JobTitleRoutingModule
  ]
})
export class JobTitleModule { }
