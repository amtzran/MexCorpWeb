import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ValidateTokenGuard} from "./modules/guards/validate-token.guard";
import {DashboardComponent} from "./modules/dashboard/dashboard.component";
import {CalendarComponent} from "./modules/calendar/calendar.component";

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: '',
    component: DashboardComponent,
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [ ValidateTokenGuard ],
    canLoad: [ ValidateTokenGuard ]
  },
  {
    path: 'calendar',
    component: CalendarComponent,
    loadChildren: () => import('./modules/calendar/calendar.module').then(m => m.CalendarModule),
  },
  /*
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
