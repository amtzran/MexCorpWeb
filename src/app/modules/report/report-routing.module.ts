import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ReportComponent} from "./report.component";
import {TableComponent} from "./components/table/table.component";

const routes: Routes = [{
  path: '',
  component: ReportComponent,
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
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
