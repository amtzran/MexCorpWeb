import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DoorTypeComponent} from "./door-type.component";
import {TableComponent} from "./components/table/table.component";

const routes: Routes = [
  {
    path: '',
    component: DoorTypeComponent,
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
export class DoorTypeRoutingModule { }
