import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthServiceService} from "../../../modules/auth/services/auth-service.service";

interface RoutesSide {
  name: string,
  route: string,
  icon: string
}

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styles: [
  ]
})
export class SideNavComponent implements OnInit {

  constructor(private router: Router,
              private authService: AuthServiceService) { }

  get user() {
    return this.authService.user
  }

  ngOnInit(): void {
  }

  menuRoute: RoutesSide[] = [
    {
      name: 'Clientes',
      route: '/customer',
      icon: 'people_alt'
    },
    {
      name: 'Empleados',
      route: '/employee/list',
      icon: 'engineering'
    },
    {
      name: 'Tareas',
      route: '/calendar',
      icon: 'schedule'
    }
  ]

  menuCatalogs: RoutesSide[] = [
    {
      name: 'Puestos',
      route: '/job-title',
      icon: 'engineering'
    },
    {
      name: 'Grupos',
      route: '/group',
      icon: 'group'
    },
    {
      name: 'Convenios',
      route: '/contract',
      icon: 'folder'
    },
    {
      name: 'Tipo Cliente',
      route: '/customer-type',
      icon: 'people_alt'
    },
    {
      name: 'Tipo Acceso',
      route: '/doors-type',
      icon: 'security'
    },
    {
      name: 'Tipo Trabajo',
      route: '/work-type',
      icon: 'work'
    },
  ]

  logout(){
    this.router.navigateByUrl('/auth/login')
    this.authService.logout()
  }

}
