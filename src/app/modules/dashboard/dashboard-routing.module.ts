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
    path: 'group',
    component: HomeComponent,
    loadChildren: () => import('../catalog/groups/groups.module').then(m => m.GroupsModule),
  },
  {
    path: 'contract',
    component: HomeComponent,
    loadChildren: () => import('../catalog/contracts/contract.module').then(m => m.ContractModule),
  },
  {
    path: 'job-title',
    component: HomeComponent,
    loadChildren: () => import('../catalog/job-titles/job-title.module').then(m => m.JobTitleModule),
  },
  {
    path: 'customer-type',
    component: HomeComponent,
    loadChildren: () => import('../catalog/customer-types/customer-type.module').then(m => m.CustomerTypeModule),
  },
  {
    path: 'door-type',
    component: HomeComponent,
    loadChildren: () => import('../catalog/door-types/door-type.module').then(m => m.DoorTypeModule),
  },
  {
    path: 'task',
    component: HomeComponent,
    loadChildren: () => import('../task/task.module').then(m => m.TaskModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
