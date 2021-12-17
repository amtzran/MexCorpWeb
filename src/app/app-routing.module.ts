import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ValidateTokenGuard} from "./modules/guards/validate-token.guard";
import {DashboardComponent} from "./modules/dashboard/dashboard.component";

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: '',
    component: DashboardComponent,
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule),
  },
  /*{
    path: 'dashboard',
    loadChildren: () => import('./modules/auth/protected/protected.module').then(m => m.ProtectedModule),
  },*/
  /*{
    path: 'customer',
    loadChildren: () => import('./modules/customer/customer.module').then(m => m.CustomerModule),
    canActivate: [ ValidateTokenGuard ],
    canLoad: [ ValidateTokenGuard ]
  },
  {
    path: 'door/customer/:customer',
    loadChildren: () => import('./modules/door/door.module').then(m => m.DoorModule),
    canActivate: [ ValidateTokenGuard ],
    canLoad: [ ValidateTokenGuard ]
  },
  {
    path: 'groups',
    loadChildren: () => import('./modules/groups/groups.module').then(m => m.GroupsModule),
    canActivate: [ ValidateTokenGuard ],
    canLoad: [ ValidateTokenGuard ]
  },*/
  {
    path: '**',
    redirectTo: 'auth'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
