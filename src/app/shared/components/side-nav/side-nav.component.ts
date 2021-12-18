import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

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

  constructor(private router: Router) { }

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
    }
  ]

  menuCatalogs: RoutesSide[] = [
    {
      name: 'Puestos',
      route: '/customer',
      icon: 'engineering'
    },
    {
      name: 'Grupos de Trabajo',
      route: '/group',
      icon: 'group'
    },
    {
      name: 'Convenios',
      route: '/customer',
      icon: 'folder'
    },
    {
      name: 'Tipo Cliente',
      route: '/customer',
      icon: 'people_alt'
    },
    {
      name: 'Tipo Acceso',
      route: '/customer',
      icon: 'security'
    },
  ]

  logout(){
    this.router.navigateByUrl('/auth/login')
  }

}
