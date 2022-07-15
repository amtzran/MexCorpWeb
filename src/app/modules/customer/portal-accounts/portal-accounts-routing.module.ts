import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PortalAccountsComponent} from "./portal-accounts.component";

const routes: Routes = [
  {
    path: '',
    component: PortalAccountsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortalAccountsRoutingModule { }
