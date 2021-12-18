import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GroupComponent} from "./pages/group/group.component";
import {TableGroupComponent} from "./components/table-group/table-group.component";

const routes: Routes = [{
  path: '',
  component: GroupComponent,
  children: [
    {
      path: '',
      component: TableGroupComponent
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
export class GroupsRoutingModule { }
