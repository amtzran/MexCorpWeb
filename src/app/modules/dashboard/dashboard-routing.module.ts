import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "../home/home.component";
import {ValidateTokenGuard} from "../guards/validate-token.guard";

const routes: Routes = [
  {
    path:'customer',
    component: HomeComponent,
    loadChildren: () => import('../customer/customers/customer.module').then(m => m.CustomerModule),
    canActivate: [ ValidateTokenGuard ],
    canLoad: [ ValidateTokenGuard ]
  },
  {
    path:'employee',
    component: HomeComponent,
    loadChildren: () => import('../employee/employee.module').then(m => m.EmployeeModule),
    canActivate: [ ValidateTokenGuard ],
    canLoad: [ ValidateTokenGuard ]
  },
  {
    path:'lifting',
    component: HomeComponent,
    loadChildren: () => import('../lifting/lifting.module').then(m => m.LiftingModule),
    canActivate: [ ValidateTokenGuard ],
    canLoad: [ ValidateTokenGuard ]
  },
  {
    path:'attendance',
    component: HomeComponent,
    loadChildren: () => import('../attendance/attendance.module').then(m => m.AttendanceModule),
    canActivate: [ ValidateTokenGuard ],
    canLoad: [ ValidateTokenGuard ]
  },
  {
    path: 'doors/customer/:customer',
    component: HomeComponent,
    loadChildren: () => import('../customer/doors/door.module').then(m => m.DoorModule),
    canActivate: [ ValidateTokenGuard ],
    canLoad: [ ValidateTokenGuard ]
  },
  {
    path: 'contacts/customer/:customer',
    component: HomeComponent,
    loadChildren: () => import('../customer/contacts/contact.module').then(m => m.ContactModule),
    canActivate: [ ValidateTokenGuard ],
    canLoad: [ ValidateTokenGuard ]
  },
  {
    path: 'comments/customer/:customer',
    component: HomeComponent,
    loadChildren: () => import('../customer/comments/comment.module').then(m => m.CommentModule),
    canActivate: [ ValidateTokenGuard ],
    canLoad: [ ValidateTokenGuard ]
  },
  {
    path: 'portal-accounts/customer/:customer',
    component: HomeComponent,
    loadChildren: () => import('../customer/portal-accounts/portal-accounts.module').then(m => m.PortalAccountsModule),
    canActivate: [ ValidateTokenGuard ],
    canLoad: [ ValidateTokenGuard ]
  },
  {
    path: 'group',
    component: HomeComponent,
    loadChildren: () => import('../catalog/groups/groups.module').then(m => m.GroupsModule),
    canActivate: [ ValidateTokenGuard ],
    canLoad: [ ValidateTokenGuard ]
  },
  {
    path: 'contract',
    component: HomeComponent,
    loadChildren: () => import('../catalog/contracts/contract.module').then(m => m.ContractModule),
    canActivate: [ ValidateTokenGuard ],
    canLoad: [ ValidateTokenGuard ]
  },
  {
    path: 'job-title',
    component: HomeComponent,
    loadChildren: () => import('../catalog/job-titles/job-title.module').then(m => m.JobTitleModule),
    canActivate: [ ValidateTokenGuard ],
    canLoad: [ ValidateTokenGuard ]
  },
  {
    path: 'customer-type',
    component: HomeComponent,
    loadChildren: () => import('../catalog/customer-types/customer-type.module').then(m => m.CustomerTypeModule),
    canActivate: [ ValidateTokenGuard ],
    canLoad: [ ValidateTokenGuard ]
  },
  {
    path: 'doors-type',
    component: HomeComponent,
    loadChildren: () => import('../catalog/door-types/door-type.module').then(m => m.DoorTypeModule),
    canActivate: [ ValidateTokenGuard ],
    canLoad: [ ValidateTokenGuard ]
  },
  {
    path: 'work-type',
    component: HomeComponent,
    loadChildren: () => import('../catalog/work-types/work-type.module').then(m => m.WorkTypeModule),
    canActivate: [ ValidateTokenGuard ],
    canLoad: [ ValidateTokenGuard ]
  },
  {
    path: 'product',
    component: HomeComponent,
    loadChildren: () => import('../catalog/products/product.module').then(m => m.ProductModule),
    canActivate: [ ValidateTokenGuard ],
    canLoad: [ ValidateTokenGuard ]
  },
  {
    path: 'turn',
    component: HomeComponent,
    loadChildren: () => import('../catalog/turns/turn.module').then(m => m.TurnModule),
    canActivate: [ ValidateTokenGuard ],
    canLoad: [ ValidateTokenGuard ]
  },
  {
    path: 'report',
    component: HomeComponent,
    loadChildren: () => import('../report/report.module').then(m => m.ReportModule),
    canActivate: [ ValidateTokenGuard ],
    canLoad: [ ValidateTokenGuard ]
  },
  {
    path: 'task',
    component: HomeComponent,
    loadChildren: () => import('../task/task.module').then(m => m.TaskModule),
    canActivate: [ ValidateTokenGuard ],
    canLoad: [ ValidateTokenGuard ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
