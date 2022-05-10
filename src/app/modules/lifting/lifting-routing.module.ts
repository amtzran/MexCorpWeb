import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {LiftingComponent} from "./lifting.component";
import {TableComponent} from "./components/table/table.component";

const routes: Routes = [
  {
    path: '',
    component: LiftingComponent,
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
export class LiftingRoutingModule { }
