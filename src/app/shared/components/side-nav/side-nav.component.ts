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

  logout(){
    this.router.navigateByUrl('/auth/login')
  }

}
