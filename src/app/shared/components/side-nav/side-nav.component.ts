import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthServiceService} from "../../../modules/auth/services/auth-service.service";
import {ModalResponse} from "../../../core/utils/ModalResponse";
import {MatDialog} from "@angular/material/dialog";
import {CrudComponent} from "./crud/crud.component";
import {ProfileUser} from "../../../modules/auth/interfaces/login.interface";

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
              private dialog: MatDialog) { }

  get user() {
    return this.authService.user
  }

  dataUser: ProfileUser = {
   name: ''
  };

  ngOnInit(): void {
    this.loadUser()
  }

  /**
   * Data User Session
   */
  loadUser(): void {
    this.authService.getUserById().subscribe(user => {
      this.dataUser = user
    })
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
      name: 'Levantamientos',
      route: '/dashboard/lifting',
      icon: 'confirmation_number'
    },
    {
      name: 'Asistencias',
      route: '/dashboard/attendance',
      icon: 'schedule'
    },
    {
      name: 'Tareas',
      route: '/dashboard/task',
      icon: 'insert_invitation'
    },
    {
      name: 'Inventario',
      route: '/dashboard/inventory',
      icon: 'inventory'
    },
    {
      name: 'Reportes',
      route: '/dashboard/report',
      icon: 'show_chart'
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
    {
      name: 'Herramientas',
      route: '/dashboard/product',
      icon: 'inventory'
    },
    {
      name: 'Turnos',
      route: '/dashboard/turn',
      icon: 'hourglass_bottom'
    },
    {
      name: 'Proveedores',
      route: '/dashboard/supplier',
      icon: 'folder'
    },
  ]

  logout(){
    this.router.navigateByUrl('../auth/login')
    this.authService.logout()
    localStorage.clear()
  }

  /**
   * Open dialog for add and update group.
   */
  openDialogProfile(dataUser : ProfileUser) {
    const dialogRef = this.dialog.open(CrudComponent, {
      autoFocus: false,
      disableClose: true,
      width: '50vw',
      data: dataUser
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === ModalResponse.UPDATE) {
        //TODO: Check logout
        //this.getContractsPaginator(this.paginator);
      }
    });
  }
}
