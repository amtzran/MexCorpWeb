import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ContractComponent} from "./contract.component";
import {TableComponent} from "./components/table/table.component";

const routes: Routes = [
  {
    path: '',
    component: ContractComponent,
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
export class ContractRoutingModule { }
