import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CommentComponent} from "./comment.component";
import {TableComponent} from "./components/table/table.component";

const routes: Routes = [{
  path: '',
  component: CommentComponent,
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
export class CommentRoutingModule { }
