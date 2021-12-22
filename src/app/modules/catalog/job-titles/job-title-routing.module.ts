import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {JobTitleComponent} from "./job-title.component";
import {TableComponent} from "./components/table/table.component";

const routes: Routes = [
  {
    path: '',
    component: JobTitleComponent,
    children: [
      {
        path: '',
        component: TableComponent
      },
      {
        path: '**',
        redirectTo: ''
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobTitleRoutingModule { }
