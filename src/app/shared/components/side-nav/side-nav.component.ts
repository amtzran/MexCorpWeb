import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthServiceService} from "../../../modules/auth/services/auth-service.service";
import {ModalResponse} from "../../../core/utils/ModalResponse";
import {MatDialog} from "@angular/material/dialog";
import {ProfileUser} from "../../interfaces/shared.interface";
import {CrudComponent} from "./crud/crud.component";

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
              private authService: AuthServiceService,
              private dialog: MatDialog,) { }

  get user() {
    return this.authService.user
  }

  userName: string | undefined = '';

  ngOnInit(): void {
    this.userName = this.user.name
  }

  menuRoute: RoutesSide[] = [
    {
      name: 'Clientes',
      route: '/dashboard/customer',
      icon: 'people_alt'
    },
    {
      name: 'Empleados',
      route: '/dashboard/employee/list',
      icon: 'engineering'
    },
    {
      name: 'Tareas',
      route: '/dashboard/task',
      icon: 'schedule'
    }
  ]

  menuCatalogs: RoutesSide[] = [
    {
      name: 'Puestos',
      route: '/dashboard/job-title',
      icon: 'engineering'
    },
    {
      name: 'Grupos',
      route: '/dashboard/group',
      icon: 'group'
    },
    {
      name: 'Convenios',
      route: '/dashboard/contract',
      icon: 'folder'
    },
    {
      name: 'Tipo Cliente',
      route: '/dashboard/customer-type',
      icon: 'people_alt'
    },
    {
      name: 'Tipo Acceso',
      route: '/dashboard/doors-type',
      icon: 'security'
    },
    {
      name: 'Tipo Trabajo',
      route: '/dashboard/work-type',
      icon: 'work'
    },
  ]

  logout(){
    this.router.navigateByUrl('../auth/login')
    this.authService.logout()
  }

  openDialogProfile(){
    console.log('ok')
  }
}
