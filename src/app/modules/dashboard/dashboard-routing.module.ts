import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "../home/home.component";

const routes: Routes = [
  {
    path:'customer',
    component: HomeComponent,
    loadChildren: () => import('../customer/customer.module').then(m => m.CustomerModule),
  },
  {
    path:'employee',
    component: HomeComponent,
    loadChildren: () => import('../employee/employee.module').then(m => m.EmployeeModule),
  },
  {
    path: 'door/customer/:customer',
    component: HomeComponent,
    loadChildren: () => import('../door/door.module').then(m => m.DoorModule),
  },
  {
    path: 'groups',
    component: HomeComponent,
    loadChildren: () => import('../groups/groups.module').then(m => m.GroupsModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
