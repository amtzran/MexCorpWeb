import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthServiceService} from "../../../auth/services/auth-service.service";

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

  constructor(private router: Router,
              private authService: AuthServiceService) { }

  ngOnInit(): void {
  }
  menuRoute: RoutesSide[] = [
    {
      name: 'Clientes',
      route: '/customer/list',
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
