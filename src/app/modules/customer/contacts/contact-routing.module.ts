import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ContactComponent} from "./contact.component";
import {TableComponent} from "./components/table/table.component";

const routes: Routes = [{
  path: '',
  component: ContactComponent,
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
export class ContactRoutingModule { }
