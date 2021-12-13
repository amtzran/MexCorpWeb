import { Component, OnInit } from '@angular/core';

interface RoutesSide {
  name: string,
  route: string,
  icon: string
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
  ]
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  menuRoute: RoutesSide[] = [
    {
      name: 'Clientes',
      route: './customer/list',
      icon: 'people_alt'
    },
    {
      name: 'Empleados',
      route: './employee/list',
      icon: 'engineering'
    }
  ]

}
